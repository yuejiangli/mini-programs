import { i18n, lang } from '../../../../i18n/lang'
import { log } from '../../../../util/util'

const types = ['default', 'primary', 'warn']
const pageObject = {
  data: {
    theme: 'light',
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    canIUseGetUserProfile: false,
    isPhoneLoading: false,
    isEmailLoading: false
  },

  onShareAppMessage() {
    return {
      title: 'button',
      path: 'packageComponent/pages/form/button/button'
    }
  },

  setDisabled() {
    this.setData({
      disabled: !this.data.disabled
    })
  },

  setPlain() {
    this.setData({
      plain: !this.data.plain
    })
  },

  setLoading() {
    this.setData({
      loading: !this.data.loading
    })
  },

  handleContact(e) {
    log(e.detail)
  },

  clickGetPhoneNumber() {
    this.setData({
      isPhoneLoading: true
    })
  },

  clickGetEmailAddress() {
    this.setData({
      isEmailLoading: true
    })
  },

  handleGetPhoneNumber(e) {
    console.log('getPhoneNumber success===', e.detail)
    const { code, errMsg } = e.detail
    if (code) {
      //发起网络请求
      wx.request({
        url: "https://tcmpp.woyaojianfei.club/getPhoneNumber",
        method: "POST",
        data: {
          appid: "mpp0ndj6q1wqzy6d",
          code
        },
        success: (res) => {
          this.setData({
            isPhoneLoading: false
          })
          console.log('getPhoneNumber request success===', res)
          const { code = -1, data = {}, msg } = res?.data || {};
          if (code === 200) { // 换取手机号信息成功
            wx.showModal({
              title: 'PhoneNumber',
              confirmText: i18n['toast6'],
              content: data.phone_info?.phoneNumber,
              showCancel: false
            })
          } else {
            console.log('getPhoneNumber request fail', res)
            wx.showModal({
              title: 'getPhoneNumber request fail',
              confirmText: i18n['toast6'],
              content: msg,
              showCancel: false
            })
          }
        },
        fail: (err) => {
          this.setData({
            isPhoneLoading: false
          })
          console.log('getPhoneNumber request fail', err)
          wx.showModal({
            title: 'getPhoneNumber request fail',
            confirmText: i18n['toast6'],
            content: err.errMsg,
            showCancel: false
          })
        },
      })
    } else {
      this.setData({
        isPhoneLoading: false
      })
      console.log('getPhoneNumber does not return code', e.detail)
      wx.showModal({
        title: 'getPhoneNumber fail',
        confirmText: i18n['toast6'],
        content: errMsg,
        showCancel: false
      })
    }
  },

  handleGetEmailAddress(e) {
    console.log('getEmailAddress success===', e.detail)
    const { code, errMsg } = e.detail
    if (code) {
      //发起网络请求
      wx.request({
        url: "https://tcmpp.woyaojianfei.club/getEmailAddress",
        method: "POST",
        data: {
          appid: "mpp0ndj6q1wqzy6d",
          code
        },
        success: (res) => {
          this.setData({
            isEmailLoading: false
          })
          console.log('getEmailAddress request success===', res)
          const { code = -1, data = {}, msg } = res?.data || {};
          if (code === 200) { // 换取邮箱信息成功
            wx.showModal({
              title: 'EmailAddress',
              confirmText: i18n['toast6'],
              content: data.email_info?.emailAddress,
              showCancel: false
            })
          } else {
            console.log('getEmailAddress request fail', res)
            wx.showModal({
              title: 'getEmailAddress request fail',
              confirmText: i18n['toast6'],
              content: msg,
              showCancel: false
            })
          }
        },
        fail: (err) => {
          this.setData({
            isEmailLoading: false
          })
          console.log('getEmailAddress request fail', err)
          wx.showModal({
            title: 'getEmailAddress request fail',
            confirmText: i18n['toast6'],
            content: err.errMsg,
            showCancel: false
          })
        },
      })
    } else {
      this.setData({
        isEmailLoading: false
      })
      console.log('getEmailAddress does not return code', e.detail)
      wx.showModal({
        title: 'getEmailAddress fail',
        confirmText: i18n['toast6'],
        content: errMsg,
        showCancel: false
      })
    }
  },

  handleOpenSetting(e) {
    log(e.detail.authSetting)
  },

  handleGetUserInfo(e) {
    log('getUserInfo: ', e.detail.userInfo)
  },
  handleGetUserProfile(e) {
    wx.getUserProfile({
      desc: `${i18n['button14']} wx.getUserProfile`, // State the use of the user's personal information, it will be displayed in the pop -up window, please fill in it with caution
      success: (res) => {
        log('wx.getUserProfile: ', res.userInfo)
      }
    })
  },
  onLoad() {
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  }
}

for (let i = 0; i < types.length; ++i) {
  (function (type) {
    pageObject[type] = function () {
      const key = `${type}Size`
      const changedData = {}
      changedData[key] = this.data[key] === 'default' ? 'mini' : 'default'
      this.setData(changedData)
    }
  }(types[i]))
}

Page(pageObject)
