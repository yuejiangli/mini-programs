
import { getStoreList } from '../../service/index'
Page({
    data: {
        storeCurrent: 1,
        storeList: [],
    },

    onLoad: function () {
        this.getStoreInfo()
    },

    //加载店铺
    getStoreInfo: function () {
        this.setData({
            storeList: getStoreList()
        })
    },


    //跳转点单
    toMenu: function (e) {
        var index = e.currentTarget.dataset.index
        var storeList = this.data.storeList
        var storeInfo = {
            id: storeList[index].id,
            storeName: storeList[index].storeName,
            address: storeList[index].address
        }
        wx.setStorageSync('storeInfo', storeInfo)
        wx.navigateTo({
            url: '/pages/menu/index',
        })
    }
})