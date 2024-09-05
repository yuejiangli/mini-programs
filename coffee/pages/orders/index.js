import i18n from '../../i18n/index';
import { getOrderList, getUserInfo } from '../../service/storage';
Page({
    data: {
        todayOrderList: [],
        orderlist: [],
        titelList: [{
            title: i18n.t("全部订单"),
            type: 0
        }, {
            title: i18n.t("进行订单"),
            type: 1
        }],
        current: 0,
        lang: {
            selfPickup: i18n.t('自提'),
            countDesc: i18n.t('合计：¥{{money}}'),
            count: i18n.t('共{{count}}件'),
            orderTime: i18n.t('下单时间'),
            delete: i18n.t('删除订单'),
            thanks: i18n.t('感谢购买'),
            historyEmpty: i18n.t('您还没有历史订单'),
            todayEmpty: i18n.t('您今天还没有下单'),
            pickup: i18n.t('请稍后凭取餐码进行取餐～'),
            buy: i18n.t('快去选择一杯喜欢的饮品吧~'),
            notYet: i18n.t('暂无'),
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
        this.getAllOrderInfo()
    },

    //获取订单信息
    getAllOrderInfo: function () {
        const orderlist = getOrderList().map(item => ({ ...item, stateName: [i18n.t('制作中'), i18n.t('待取餐'), i18n.t('已下单')][item.status] }));
        const todayOrderList = orderlist.filter(item => item.status !== 3)
        this.setData({
            orderlist,
            todayOrderList,
        })
    },

    //点击切换标题
    titleClick: function (e) {
        this.setData({
            current: !this.data.current
        })
    },

    //跳转详情页面
    toOrderDetail: function (e) {
        const index = e.currentTarget.dataset.index
        const orderId = this.data.orderlist[index].id
        wx.navigateTo({
            url: `/subpackages/orderDetails/index?orderId=${orderId}`,
        })
    }
})