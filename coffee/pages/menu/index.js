import i18n from '../../i18n/index';
import { getProductList } from '../../service/request';
import { getStoreInfo, getUserInfo, saveShoppingCar } from '../../service/storage';
Page({
    data: {
        orderType: '1',
        cartList: [],
        cartNum: 0,
        orderTotal: 0,
        storeInfo: null,
        productListDatas: [],
        lang: {
            confirmButtonText: i18n.t('去结算'),
            orderType1: i18n.t('自提'),
            orderType2: i18n.t('外卖'),
            money: i18n.t('￥'),
        }
    },

    onLoad: function (options) {
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
            orderType: options.orderType,
            storeInfo: getStoreInfo(),
        })
        this.getCommodityInfo()
        wx.setNavigationBarTitle({
            title: i18n.t('点单')
        })
    },

    // 切换订单类型
    changeOrderType: function (e) {
        const orderType = e.currentTarget.dataset.type
        this.setData({
            orderType: orderType === "1" ? "2" : "1",
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
        const id = e.currentTarget.dataset.id
        const productList = this.data.productListDatas
        const cartList = this.data.cartList
        if (cartList.find(v => v.id === id)) {
            this.setData({
                cartList: cartList.map(v => {
                    return v.id === id ? { ...v, number: v.number + 1 } : v;
                }),
                productListDatas: productList.map(v => {
                    return v.id === id ? { ...v, number: v.number + 1 } : v;
                }),
            })
        } else {
            this.setData({
                cartList: cartList.concat({ ...productList.find(v => v.id === id), number: 1 }),
                productListDatas: productList.map(v => {
                    return v.id === id ? { ...v, number: v.number + 1 } : v;
                }),
            })
        }
        this.countCart()
    },

    //减少商品
    sub: function (e) {
        const id = e.currentTarget.dataset.id
        const productList = this.data.productListDatas
        const cartList = this.data.cartList
        if (cartList.find(v => v.id === id)) {
            this.setData({
                cartList: cartList.map(v => {
                    return v.id === id ? { ...v, number: v.number - 1 } : v;
                }),
                productListDatas: productList.map(v => {
                    return v.id === id ? { ...v, number: v.number - 1 } : v;
                }),
            })
        }
        this.countCart()
    },

    //计算商品总价
    countCart: function () {
        const cartList = this.data.cartList
        this.setData({
            orderTotal: cartList.reduce((s, c) => s + c.price * c.number, 0),
            cartNum: cartList.reduce((s, c) => s + c.number, 0),
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