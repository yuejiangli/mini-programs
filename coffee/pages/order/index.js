
import i18n from '../../i18n/index';
import { getStoreList } from '../../service/request'
import { saveStoreInfo } from '../../service/storage'
Page({
    data: {
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
        const index = e.currentTarget.dataset.index
        const storeList = this.data.storeList
        const storeInfo = {
            id: storeList[index].id,
            storeName: storeList[index].storeName,
            address: storeList[index].address
        }
        saveStoreInfo(storeInfo)
        wx.navigateTo({ url: '/pages/menu/index' })
    }
})