import i18n from '../../i18n/index';
import { getShoppingCar, getStoreInfo, getUserInfo, saveOrderInfo } from '../../service/storage'
Page({
    data: {
        phoneNumber: '17848291998',
        remarks: '',
        sumNum: 0,
        orderTotal: 0,
        shoppingCar: [],
        storeInfo: null,
        isShowConfirmStoreAdress: 0,
        channelType: 1,
        lang: {
            pleaseCheck: i18n.t('请仔细确认门店'),
            cardTitle: i18n.t('请注意取餐号，及时取餐'),
            cardSubTitle: i18n.t('30分钟内饮用，口味更佳'),
            paymentMethods: i18n.t('支付方式'),
            wechatPay: i18n.t('微信支付'),
            remark: i18n.t('备注'),
            remarkDefault: i18n.t('口味、偏好等要求'),
            total: i18n.t('合计'),
            money: i18n.t('￥'),
            moneyTotal: i18n.t('合计：¥{{money}}'),
            notAvailable: i18n.t('暂无可用'),
            coupons: i18n.t('优惠券'),
            orderDetails: i18n.t('订单详情'),
            phone: i18n.t('联系电话'),
            phonePlaceholder: i18n.t('请输入手机号'),
            play: i18n.t('支付'),
            checkStore: i18n.t('请再次确认下单门店'),
            confirmPayment: i18n.t('确认付款并下单'),
            count: i18n.t('共{{total}}件'),
        }
    },

    onLoad: function () {
        const shoppingCar = getShoppingCar()
        const storeInfo = getStoreInfo()
        this.setData({
            storeInfo,
            shoppingCar,
            sumNum: shoppingCar.reduce((s, c) => s + c.number, 0),
            orderTotal: shoppingCar.reduce((s, c) => s + c.number * c.price, 0),
        })
    },

    //从备注页面跳转回来
    onShow: function () {
        const remarks = wx.getStorageSync('remarks')
        this.setData({
            remarks: remarks
        })
    },

    //确认门店弹窗  
    confirmOrder: function () {
        const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (this.data.phoneNumber == '' || !regMobile.test(this.data.phoneNumber)) {
            wx.showToast({
                title: i18n.t('请正确输入手机号'),
                icon: 'none'
            })
            return;
        }
        this.setData({
            isShowConfirmStoreAdress: 1,
        })
    },

    //确认支付
    confirmtoSubmit: function () {
        wx.showLoading({
            title: i18n.t('正在支付'),
        })

        const orderCode = `${Number(new Date())}${Math.round(Math.random() * 1000000000)}`
        const id = `orderId-${orderCode}`
        const data = {
            id,
            orderCode,
            orderTime: new Date().toLocaleString(),
            status: Math.floor(Math.random() * 3),
            takeNumber: Math.round(Math.random() * 1000),
            userInfo: getUserInfo(),
            phoneNumber: this.data.phoneNumber,
            remarks: this.data.remarks,
            orderTotal: this.data.orderTotal,
            sumNum: this.data.sumNum,
            productDetail: this.data.shoppingCar,
            storeInfo: this.data.storeInfo
        }
        const orderId = saveOrderInfo(data);
        setTimeout(() => {
            wx.showToast({
                title: i18n.t('支付成功'),
                icon: 'success'
            })
        }, 450)
        setTimeout(() => {
            wx.reLaunch({
                url: `/subpackages/orderDetails/index?orderId=${orderId}`,
            })
        }, 750);
    },

    //关闭确认弹窗
    closeConfirm: function () {
        this.setData({
            isShowConfirmStoreAdress: 0
        })
    },

    //跳转备注
    goRemarks: function () {
        wx.setStorageSync('remarks', this.data.remarks)
        wx.navigateTo({
            url: '/subpackages/remarks/index',
        })
    },

    //电话号码输入
    phoneInput: function (e) {
        var phoneNum = e.detail.value
        this.setData({
            phoneNumber: phoneNum
        })
    }
})