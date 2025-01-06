// pages/login/login.js
import { i18n } from '../../i18n/lang';
import Config from '../../utils/configData';
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
            url: `${Config.BASEURL}/getUserInfo`,
            method: "POST",
            data: {
              appid: Config.APPID,
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
                  avatarUrl: data.avatarUrl || '../../res/images/avatar2.png',
                  nickName: data.userName,
                  id: data.id,
                  token: data.token
                }
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 500)
              } else {
                const msg = res?.data?.data?.msg || '/getUserInfo request fail'
                const errcode = res?.data?.data?.errcode || code
                console.log('/getUserInfo request fail', res)
                wx.showModal({
                  title: i18n['登录失败'],
                  confirmText: i18n['确定'],
                  content: `/getUserInfo fail:${msg}[code:${errcode}]`,
                  showCancel: false
                })
              }
            },
            fail: (err) => {
              this.setData({
                isLoading: false
              })
              console.log('wx.request fail', err)
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
            content: res.errMsg,
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
      phoneNumber: '185****1111'
    }
    wx.navigateBack({
      delta: 1
    })
  }
})