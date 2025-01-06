// pages/bookHotel/bookHotel.js
import { i18n } from '../../i18n/lang';
const app = getApp()
var roomPrice;
var hotelName;
var roomName;
var startDate;
var endDate;

Page({

     /**
      * 页面的初始数据
      */
     data: {
          isDiscount: false,
          roomPrice,
          hotelName,
          roomName,
          startDate,
          endDate,
          discount: i18n['不选择优惠'],
          name: '',
          phone: '',
          remark: '',
          i18n,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          wx.setNavigationBarTitle({
               title: i18n['客房预订']
          })
          console.log(options);
          roomPrice = options.price;
          hotelName = options.hotelName;
          roomName = options.roomName;
          startDate = options.startDate;
          endDate = options.endDate;

          this.setData({
               roomPrice: roomPrice,
               hotelName: hotelName,
               roomName: roomName,
               startDate: startDate,
               endDate: endDate,
               i18n,
          });
     },
     payOrder(){
          wx.showLoading({
               title: i18n['提交中']
          })
          if(app.globalData.noServer) {
               this.requestPayment({
                    package:"fake",
                    timeStamp: Math.floor(Date.now() / 1000),
                    nonceStr: "",
                    signType: "RSA",
                    paySign: "MOCK"
               })
          } else {
               wx.request({
                    url: 'https://tcmpp.woyaojianfei.club/commonOrder',
                    method: 'POST',
                    data: {
                         appid: 'mpj04mtjdt4rho32',
                         attach: "Book a hotel",
                         body: "Hotel pay order",
                         total: this.data.roomPrice,
                         id: app.globalData.userInfo?.id
                    },
                    success: (res) => {
                         wx.hideLoading();
                         if(res.data.code === 200){
                              this.requestPayment(res.data)
                         } else {
                              console.log('wx.request fail===', res)
                              wx.showModal({
                                   title: 'wx.request fail',
                                   confirmText: i18n['确定'],
                                   content: 'The returned code is not equal to 200',
                                   showCancel: false
                              })
                         }
                    },
                    fail: (err) => {
                         wx.hideLoading();
                         console.log('wx.request fail===', err)
                         wx.showModal({
                              title: 'wx.request fail',
                              confirmText: i18n['确定'],
                              content: err.errMsg,
                              showCancel: false
                         })
                    }
               })
          }
     },
     requestPayment(obj) {
          const { nonceStr, package:vpve,paySign,signType,timeStamp } = obj;
          wx.requestPayment({
               package:vpve,
               nonceStr,
               paySign,
               signType,
               timeStamp,
               success: () => {
                    wx.showLoading({
                         title: i18n['支付成功']
                    })
                    const key = `orderTodo_${app.globalData.userInfo?.nickName}`
                    const orderList = wx.getStorageSync(key) || []
                    orderList.push(this.data)
                    wx.setStorage({
                         key,
                         data: orderList,
                         success: (res) => {
                              console.log('setStorage===success', res)
                         },
                         fail: (err) => {
                              console.log('setStorage===fail', err)
                         }
                    })
                    setTimeout(() => {
                         wx.reLaunch({
                              url: '/pages/orderList/orderList?type=todo',
                         })
                    }, 1000)
               },
               fail: (err) => {
                    wx.hideLoading();
                    console.log('wx.requestPayment fail===', err)
                    wx.showModal({
                         title: 'wx.requestPayment fail',
                         confirmText: i18n['确定'],
                         content: err.errMsg,
                         showCancel: false
                    })
               },
          });
     },
     payBtn() {
          if(!this.data.name || !this.data.phone) {
               wx.showModal({
                    confirmText: i18n['确定'],
                    content: i18n['请填写入住人及手机号码'],
                    showCancel: false
               })
          } else {
               this.payOrder()
          }
     },

     inputEvent(e) {
          const key = e?.detail?.inputKey
          this.setData({
              [key] : e?.detail?.value
          })
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {

     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {

     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {

     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})