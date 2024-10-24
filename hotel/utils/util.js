const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getRandomScore(m, n) {
  // 生成一个 m 到 n 之间的随机数
    const randomNum = Math.random() * (n - m) + m;
    // 保留一位小数
    return Math.round(randomNum * 10) / 10;
}

function getRandomPrice(min, max) {
  // 生成 min 到 max 之间的随机整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  formatTime,
  getRandomScore,
  getRandomPrice
}
