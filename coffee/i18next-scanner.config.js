module.exports = {
  input: [
    './**/*.{js,wxml}',
    '!./node_modules/**/*',
    '!./miniprogram_npm/**/'
  ],
  output: './', //输出目录
  options: {
    // debug: true,
    func: {
      list: ['i18n.t'],
      extensions: ['.js', '.wxml']
    },
    lngs: ['zh', 'en', 'id','fr'],
    defaultLng: 'en',
    defaultValue: function (lng, ns, key) {
      if (lng === 'zh') {
        return key;
      }
      return '';
    },
    resource: {
      loadPath: './i18n/json/{{lng}}.json', //输入路径
      savePath: './i18n/json/{{lng}}.json', //输出路径
      jsonIndent: 2,
      lineEnding: '\n'
    },

    keepRemoved: true,
    removeUnusedKeys: true,
  },
};