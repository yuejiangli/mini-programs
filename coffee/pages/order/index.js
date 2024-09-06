
import i18n from '../../i18n/index';
import { getStoreList } from '../../service/request'
import { saveStoreInfo } from '../../service/storage'
import { setTabBar } from '../../utils/i18n';
Page({
    data: {
        orderType: "1",
        storeList: [],
        lang: {
            selectStore: i18n.t('选择门店'),
            empty: i18n.t('当前地区暂时未开放门店'),
            orderNow: i18n.t('现在下单，无需等待'),
            businessHours: i18n.t('营业时间'),
            operating: i18n.t('营业中'),
            resting: i18n.t('休息中'),
            goToOrder: i18n.t('去点单'),
        }
    },

    onLoad: function (option) {
        this.setData({ orderType: option?.orderType || '1' })
        setTabBar();
        wx.setNavigationBarTitle({
            title: i18n.t('点单')
        })
        this.getStoreInfo()
    },

    //加载店铺
    getStoreInfo: function () {
        this.setData({
            storeList: getStoreList()
        })
    },
    makePhoneCall(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.phone,
        })
    },

    //跳转点单
    toMenu: function (e) {
        const index = e.currentTarget.dataset.index
        const storeList = this.data.storeList
        const storeInfo = {
            id: storeList[index].id,
            storeName: storeList[index].storeName,
            address: storeList[index].address,
            hotLine: storeList[index].hotLine,
        }
        saveStoreInfo(storeInfo)
        wx.navigateTo({ url: `/pages/menu/index?orderType=${this.data.orderType}` })
    }
})