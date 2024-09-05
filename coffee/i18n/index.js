const en = require('./js/en.js');
const zh = require('./js/zh.js');

const langs = {
  en,
  'zh-Hans': zh,
  'zh_CN': zh,
  zh,
  id: en,
}

const extractPlaceholders = (str) => {
  const regex = /{{\s*([^}]+)\s*}}/g;
  let match;
  const result = [];

  while ((match = regex.exec(str)) !== null) {
    result.push([match[0], match[1]])
  }

  return result;
};

function t(str, options) {
  const lang = langs[getApp().globalData.lang];
  const placeholders = extractPlaceholders(str);
  let langStr = lang[str];
  if (options) {
    placeholders.forEach(([v, k]) => {
      langStr = langStr.replace(v, options[k]);
    })
  }
  return langStr ?? str;
}

module.exports = { t }