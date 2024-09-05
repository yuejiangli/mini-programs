import i18n from '../../i18n/index';
import { getUserInfo, saveUserInfo } from '../../service/storage';
Page({
    data: {
        userInfo: null,
        levelName: i18n.t("初级粉丝"),
        lang: {
            login: i18n.t('登录'),
            menu1: i18n.t('立即点单'),
            menu1Desc: i18n.t('即刻点餐，立享优惠'),
            menu2: i18n.t('外卖'),
            menu2Desc: i18n.t('无接触，放心点'),
            menu3: i18n.t('非常好喝'),
            menu3Desc: i18n.t('喝点好喝咖啡'),
            menu4: i18n.t('快来点吧'),
            menu4Desc: i18n.t('此处招商'),
            memberScore: i18n.t('积分')
        }
    },

    onLoad: function () {
        const userInfo = getUserInfo();
        if (!userInfo) {
            wx.showToast({
                title: i18n.t('请点击登录按钮登录'),
                icon: 'none'
            })
        } else {
            this.setData({ userInfo })
        }
    },

    //跳转选择店铺
    goStore: function () {
        wx.reLaunch({
            url: '/pages/order/index',
        })
    },

    defaultLogin: function () {
        const defaultUser = {
            id: 'admin',
            account: 'admin',
            userName: 'User-86E446F65',
            memberScore: Math.round(Math.random() * 10000)
        };
        this.setData({ userInfo: defaultUser })
        saveUserInfo(defaultUser)
        wx.showToast({
            title: i18n.t('登录成功'),
        })
    },

    //登录
    doLogin: function () {
        const { query: { noServer } } = wx.getEnterOptionsSync();

        if (`${noServer}` === '1') {
            this.defaultLogin();
        } else {
            wx.login({
                success: ({ code }) => {
                    if (code) {
                        wx.request({
                            url: 'https://tcmpp.woyaojianfei.club/getUserInfo',
                            method: 'POST',
                            data: {
                                appid: 'mpf3vd8c3d50q4ip',
                                code: code
                            },
                            success: (res) => {
                                const { data } = res?.data || {};
                                const userInfo = { ...data, memberScore: Math.round(Math.random() * 10000) }
                                if (userInfo.account) { // 换取用户信息成功
                                    this.setData({ userInfo })
                                    saveUserInfo(userInfo)
                                    wx.showToast({
                                        title: i18n.t('登录成功'),
                                    })
                                } else {
                                    this.defaultLogin();
                                }
                            },
                            fail() {
                                this.defaultLogin();
                            }
                        })

                    }
                }
            })
        }
    }
})