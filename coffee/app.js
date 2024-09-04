import i18n from './i18n/index'
//app.js
App({
    globalData: {
        lang: wx.getSystemInfoSync().language,
        t: i18n.t,
    }
})