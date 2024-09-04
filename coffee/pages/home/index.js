import i18n from '../../i18n/index';
Page({
    data: {
        userInfo: null,
        levelName: "初级茶粉",
        topBannerList: null,
        channelType: 1,
        memberScore: 0,
        authViewBuy: !1,
        storeSize: 0,
        memberPoint: 0,
        isShowNewWxAuth: !0,
        isSetBirthday: !1,
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
        }
    },

    onLoad: function () {
        if (wx.getStorageSync('userId') == '') {
            wx.showToast({
                title: i18n.t('请点击登录按钮登录'),
                icon: 'none'
            })
        }
    },

    //跳转选择店铺
    goStore: function () {
        wx.reLaunch({
            url: '/pages/order/index',
        })
    },

    //登录
    doLogin: function () {
        wx.getUserProfile({
            desc: '用于登录',
            success(resd) {
                const rawData = JSON.parse(resd.rawData)
                console.log(rawData)
                // wx.login({
                //     success(res){
                //         console.log(res.code)
                //         wx.request({
                //           url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx31cca75be7002e23&secret=c5895d3abb8f09878e08ff7088887752&js_code='+res.code+'&grant_type=authorization_code',
                //           success(res){
                //             console.log(res.data)
                //               wx.request({
                //                 url: 'http://localhost:8085/user/login',
                //                 method:'POST',
                //                 data:{
                //                     openId:res.data.openid,
                //                     nickName:rawData.nickName,
                //                     avatarUrl:rawData.avatarUrl,
                //                 },
                //                 success(res){
                //                     wx.setStorageSync('userId', res.data.data.id)
                //                     this.setData({
                //                         userInfo:rawData,
                //                          "userInfo.memberScore":res.data.data.memberScore
                //                     })
                //                 }
                //               })
                //           }
                //         })
                //     }
                // })
                wx.setStorageSync('userId', 'hohoho')
                this.setData({
                    userInfo: rawData,
                    "userInfo.memberScore": 'hohohohohoho'
                })
            }
        })


    }
})