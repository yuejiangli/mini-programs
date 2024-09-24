import i18n from '../../i18n/index';
import { getOrderInfo } from '../../service/storage'

Page({
    data: {
        order: null,
        orderStatusList: [{
            statusCode: 0,
            statusName: i18n.t("已下单"),
            imgUrl: "../../static/img/yixiadan-select.png",
            unImgUrl: "../../static/img/yixiadan.png",
            isThis: 0
        }, {
            statusCode: 1,
            statusName: i18n.t("制作中"),
            imgUrl: "../../static/img/zhizuozhong-select.png",
            unImgUrl: "../../static/img/zhizuozhong.png",
            isThis: 0
        }, {
            statusCode: 2,
            statusName: i18n.t("待取餐"),
            imgUrl: "../../static/img/daiqucan-select.png",
            unImgUrl: "../../static/img/daiqucan.png",
            isThis: 0
        }, {
            statusCode: 3,
            statusName: i18n.t("已完成"),
            imgUrl: "../../static/img/yiwancheng-select.png",
            unImgUrl: "../../static/img/yiwancheng.png",
            isThis: 0
        }],
        lang: {
            buyAgain: i18n.t("再来一单"),
            totalMoney: i18n.t("合计"),
            orderInfo: i18n.t("订单信息"),
            orderCode: i18n.t("订单号"),
            orderStore: i18n.t("下单门店"),
            pickUpType: i18n.t("取餐方式"),
            selfPickup: i18n.t("自提"),
            orderTime: i18n.t("下单时间"),
            remark: i18n.t("备注"),
            no: i18n.t("无"),
            takeNumber: i18n.t("取餐码"),
            orderComplete: i18n.t("订单已完成"),
            pickUpComplete: i18n.t("取餐完成，期待您的再次光顾"),
            money: i18n.t("￥"),
        }
    },

    onLoad: function (option) {
        wx.setNavigationBarTitle({
            title: i18n.t('订单详情')
        })
        this.getOrderDetail(option.orderId)
    },
    makePhoneCall(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.phone,
        })
    },

    // 获取订单详情
    getOrderDetail: function (orderId) {
        const orderInfo = getOrderInfo(orderId)
        this.setData({ order: orderInfo })
        const orderStatusList = this.data.orderStatusList
        for (let i = 0; i < orderStatusList.length; i++) {
            const statusCode = orderStatusList[i].statusCode
            const flag = "orderStatusList[" + i + "].isThis"
            if (orderInfo.status == statusCode) {
                this.setData({
                    [flag]: 1,
                })
            }
        }
    },

    // 再来一单
    buyAgain: function () {
        wx.reLaunch({ url: '/pages/menu/index' })
    },
})