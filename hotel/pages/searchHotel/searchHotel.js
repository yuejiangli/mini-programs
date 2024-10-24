// pages/searchHotel/searchHotel.js
import { i18n } from '../../i18n/lang'
import Mock from '../../utils/mockData'
var Util = require('../../utils/util.js')
var mHotelList = [];

function HotelBean() {
     var image;
     var name;
     var score;
     var service;
     var address;
     var distance;
     var price;
     var test;
}

Page({

     /**
      * 页面的初始数据
      */
     data: {
          location: '',
          hotelArray: [],
          isFilter: false,
          filterArray: [],
          loadenable: false,
          shownavindex: 1,
          priceL2H: true,
          length: 10,
          i18n,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          wx.setNavigationBarTitle({
               title: i18n['酒店列表']
          })
          mHotelList = []
          this.setData({
               location: options.location,
               i18n,
          });

          for (var i = 0; i < this.data.length; i++) {
               var hotelBean = new HotelBean();
               hotelBean = {
                    ...Mock.HotelObj,
                    name: `${Mock.HotelObj.name}${i+1}`,
                    address: `${Mock.HotelObj.address}${i+1}`,
                    score: Util.getRandomScore(3, 5),
                    distance: Util.getRandomScore(1, 4),
                    price: Util.getRandomPrice(100, 300)
               }

               mHotelList.push(hotelBean);
          }

          this.setData({
               hotelArray: mHotelList
          });
     },

     filterMenuTap: function (e) {
          var index = e ? e.currentTarget.dataset.index : this.data.shownavindex;
          this.setData({
               shownavindex: index
          });
          let sortedItems = [];
          // 按照名称排序
          if (index == 1) {
               sortedItems = this.data.hotelArray.slice().sort((a, b) => {
                    const numA = parseInt(a.name.replace(/\D/g, ''), 10);
                    const numB = parseInt(b.name.replace(/\D/g, ''), 10);
                    return numA - numB;
               });
          }
          // 按照评分排序
          if(index == 3) {
               sortedItems = this.data.hotelArray.slice().sort((a, b) => b.score - a.score);
          }
          // 按照距离排序
          if(index == 4) {
               sortedItems = this.data.hotelArray.slice().sort((a, b) => a.distance - b.distance);
          }
          if (index == 2) {
               if(this.data.priceL2H) {
                    // 按照价格由低到高排序
                    sortedItems = this.data.hotelArray.slice().sort((a, b) => a.price - b.price);
               } else {
                    // 按照价格由高到低排序
                    sortedItems = this.data.hotelArray.slice().sort((a, b) => b.price - a.price);
               }
               if(e) {
                    var priceL2H = !this.data.priceL2H;
                    this.setData({
                         priceL2H: priceL2H,
                    });
               }
          } else {
               this.setData({
                    priceL2H: true
               });
          }
          this.setData({
               hotelArray: sortedItems
          })
     },

     filterTap: function () {
          wx.redirectTo({
               url: '../hotelFilter/hotelFilter',
          })
     },

     locationTap: function () {
          wx.navigateTo({
               url: '../select_city/select_city'
          })
     },

     inputListener: function (e) {
          if(e.detail.value) {
               const filteredItems = this.data.hotelArray.filter(item => item.name.includes(e.detail.value));
               this.setData({
                    isFilter: true,
                    filterArray: filteredItems
               })
          } else {
               this.setData({
                    isFilter: false,
                    filterArray: []
               })
          }
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
          var that = this;
          setTimeout(() => {
               mHotelList = [];
               that.setData({
                    length: 10,
                    shownavindex: '1'
               })
               for (var i = 0; i < that.data.length; i++) {
                    var hotelBean = new HotelBean();
                    hotelBean = {
                         ...Mock.HotelObj,
                         name: `${Mock.HotelObj.name}${i+1}`,
                         address: `${Mock.HotelObj.address}${i+1}`,
                         score: Util.getRandomScore(3, 5),
                         distance: Util.getRandomScore(1, 4),
                         price: Util.getRandomPrice(100, 300)
                    }

                    mHotelList.push(hotelBean);
               }

               that.setData({
                    hotelArray: mHotelList,
                    length: that.data.length + 10
               });
               wx.showToast({
                    title: i18n['刷新成功'],
                    duration: 1500
               })
               wx.stopPullDownRefresh();
          }, 2000);
     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {
          var that = this;
          this.setData({
               loadenable: true
          })
          setTimeout(() => {
               for (var i = this.data.length; i < this.data.length + 10; i++) {
                    var hotelBean = new HotelBean();
                    hotelBean = {
                         ...Mock.HotelObj,
                         name: `${Mock.HotelObj.name}${i+1}`,
                         address: `${Mock.HotelObj.address}${i+1}`,
                         score: Util.getRandomScore(3, 5),
                         distance: Util.getRandomScore(1, 4),
                         price: Util.getRandomPrice(100, 300)
                    }

                    mHotelList.push(hotelBean);
               }

               that.setData({
                    hotelArray: mHotelList,
                    length: this.data.length + 10,
                    loadenable: false
               });
               that.filterMenuTap()
          }, 2000);

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})