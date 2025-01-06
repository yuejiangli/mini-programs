// pages/login/login.js
import { i18n } from '../../i18n/lang';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nextBtnBc: '#4a4c5b',
    isLoading: false,
    i18n
  },
  onLoad() {
    this.setData({
      i18n
    })
  },
  // 登录
  login: function () {
    this.setData({
      isLoading: true
    })
    wx.login({
      success: (res) => {
        console.log('wx.login success===', res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: "https://tcmpp.woyaojianfei.club/getUserInfo",
            method: "POST",
            data: {
              appid: "mpj04mtjdt4rho32",
              code: res.code
            },
            success: (res) => {
              this.setData({
                isLoading: false
              })
              console.log('wx.request success===', res)
              const { code = -1, data = {} } = res?.data || {};
              if (code === 200) { // 换取用户信息成功
                wx.showToast({
                    title: i18n['登录成功'],
                    icon: 'success',
                    duration: 500
                })
                app.globalData.userInfo = {
                  avatarUrl: '../../res/images/avatar2.png',
                  nickName: data.userName,
                  id: data.id
                }
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 500)
              } else {
                console.log('getUserInfo request fail', res)
                wx.showModal({
                  title: i18n['登录失败'],
                  confirmText: i18n['确定'],
                  content: 'getUserInfo request fail',
                  showCancel: false
                })
              }
            },
            fail: (err) => {
              this.setData({
                isLoading: false
              })
              console.log('getUserInfo request fail', err)
              wx.showModal({
                title: i18n['登录失败'],
                confirmText: i18n['确定'],
                content: err.errMsg,
                showCancel: false
              })
            },
          })
        } else {
          this.setData({
            isLoading: false
          })
          console.log('wx.login does not return code', res)
          wx.showModal({
            title: i18n['登录失败'],
            confirmText: i18n['确定'],
            content: err.errMsg,
            showCancel: false
          })
        }
      },
      fail: (err) => {
        this.setData({
          isLoading: false
        })
        console.log('wx.login fail===', err)
        wx.showModal({
          title: i18n['登录失败'],
          confirmText: i18n['确定'],
          content: err.errMsg,
          showCancel: false
        })
      }
    })
  },
  loginQuick() {
    app.globalData.userInfo = {
      avatarUrl: '../../res/images/avatar.png',
      nickName: '185****1111'
    }
    wx.navigateBack({
      delta: 1
    })
  }
})