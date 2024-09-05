import i18n from '../../i18n/index';
import { getProductList } from '../../service/request';
import { getStoreInfo, getUserInfo, saveShoppingCar } from '../../service/storage';
Page({
    data: {
        orderType: 1,
        cartList: [],
        cartNum: 0,
        orderTotal: 0,
        storeInfo: null,
        productListDatas: [],
        lang: {
            confirmButtonText: i18n.t('去结算'),
            orderType1: i18n.t('自提'),
            orderType2: i18n.t('外卖'),
        }
    },

    onLoad: function () {
        const userInfo = getUserInfo();
        if (!userInfo) {
            wx.showToast({
                title: i18n.t('请先登录后操作'),
                icon: 'none'
            })
            setTimeout(() => {
                wx.reLaunch({
                    url: '/pages/home/index',
                })
            }, 750)
            return;
        }
        this.setData({
            storeInfo: getStoreInfo(),
        })
        this.getCommodityInfo()
    },

    // 切换订单类型
    changeOrderType: function (e) {
        const orderType = e.currentTarget.dataset.type
        this.setData({
            orderType: orderType === 1 ? 2 : 1,
        })
    },

    //加载商品
    getCommodityInfo: function () {
        this.setData({
            productListDatas: getProductList()
        })
    },

    //添加商品
    add: function (e) {
        const index = e.currentTarget.dataset.index
        var productList = this.data.productListDatas
        var cartList = this.data.cartList
        var flag = "productListDatas[" + index + "].number"
        var number = productList[index].number
        number++
        var cartNum = this.data.cartNum
        cartNum++
        if (number == 1) {
            cartList.push(this.data.productListDatas[index])
        }
        this.setData({
            [flag]: number,
            cartNum: cartNum,
            cartList: cartList
        })
        this.countCart()
    },

    //减少商品
    sub: function (e) {
        var productList = this.data.productListDatas
        var cartList = this.data.cartList
        const index = e.currentTarget.dataset.index
        var flag = "productListDatas[" + index + "].number"
        var number = productList[index].number
        number--
        var cartNum = this.data.cartNum
        cartNum--
        if (number == 0) {
            var i = cartList.indexOf(productList[index])
            console.log(i)
            i != -1 ? cartList.splice(i, 1) : null
        }
        this.setData({
            [flag]: number,
            cartNum: cartNum,
            cartList: cartList
        })
        this.countCart()
    },

    //计算商品总价
    countCart: function () {
        var sum = 0
        var cartList = this.data.cartList
        console.log(cartList)
        for (var i = 0; i < cartList.length; i++) {
            sum = sum + cartList[i].price * cartList[i].number
        }
        this.setData({
            orderTotal: sum
        })
    },

    //跳转确认订单
    goConfirmOrder: function () {
        wx.setStorageSync('remarks', '')
        if (this.data.cartList.length <= 0) {
            wx.showToast({
                title: i18n.t('请选择商品下单~'),
                icon: 'none'
            })
            return;
        }
        wx.showLoading({
            title: i18n.t('正在结算'),
        })
        saveShoppingCar(this.data.cartList)
        setTimeout(() => {
            wx.hideLoading()
            wx.navigateTo({
                url: '/pages/confirmOrder/index',
            })
        }, 750)
    }
})