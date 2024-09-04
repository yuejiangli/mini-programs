import i18n from '../../i18n/index';
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
        console.log(this.data.lang)
        // if (wx.getStorageSync('userId') == '') {
        //     wx.showToast({
        //         title: '请先登录后操作',
        //         icon: 'none'
        //     })
        //     setTimeout(() => {
        //         wx.reLaunch({
        //             url: '/pages/extendIndex/extendIndex',
        //         })
        //     }, 750)
        //     return;
        // }
        this.getAllOrderInfo()
    },

    //获取订单信息
    getAllOrderInfo: function () {
        const orderlist = [
            {
                id: 'hohoho0',
                storeName: i18n.t('星巴克高新区店'),
                stateName: i18n.t('制作中'),
                orderTime: '2024-09-18 15:32:22',
                isShowTackNumUi: true,
                takeNumber: 168,
                productDetail: [
                    {
                        imgUrl: '../../static/img/coffee/espresso/square/espresso_pic_2_square.png',
                    }
                ],
                sumNum: 3,
                orderTotal: 84,

            },
            {
                id: 'hohoho1',
                storeName: i18n.t('星巴克高新区店'),
                stateName: i18n.t('待取餐'),
                orderTime: '2024-09-18 15:33:18',
                isShowTackNumUi: true,
                takeNumber: 169,
                productDetail: [
                    {
                        imgUrl: '../../static/img/coffee/espresso/square/espresso_pic_3_square.png',
                    }
                ],
                sumNum: 2,
                orderTotal: 94,
            },
            {
                id: 'hohoho2',
                storeName: i18n.t('星巴克高新区店'),
                stateName: i18n.t('已完成'),
                orderTime: '2024-08-16 13:22:15',
                isShowTackNumUi: true,
                takeNumber: 18,
                productDetail: [
                    {
                        imgUrl: '../../static/img/coffee/black_coffee/square/black_coffee_pic_1_square.png',
                    }
                ],
                sumNum: 1,
                orderTotal: 72,
            }
        ];
        const todayOrderList = [
            {
                id: 'hohoho0',
                storeName: i18n.t('星巴克高新区店'),
                stateName: i18n.t('制作中'),
                orderTime: '2024-09-18 15:32:22',
                isShowTackNumUi: true,
                takeNumber: 168,
                productDetail: [
                    {
                        imgUrl: 'http://res.hualala.com/basicdoc/e7b6cb17-ae51-484a-8970-3e414054955d.jpg',
                    }
                ],
                sumNum: 3,
                orderTotal: 84,

            },
            {
                id: 'hohoho1',
                storeName: i18n.t('星巴克高新区店'),
                stateName: i18n.t('待取餐'),
                orderTime: '2024-09-18 15:33:18',
                isShowTackNumUi: true,
                takeNumber: 169,
                productDetail: [
                    {
                        imgUrl: 'http://res.hualala.com/basicdoc/e7b6cb17-ae51-484a-8970-3e414054955d.jpg',
                    }
                ],
                sumNum: 2,
                orderTotal: 124,

            }
        ];
        this.setData({
            orderlist,
            todayOrderList,
        })
        // wx.request({
        //     url: 'http://localhost:8085/order/info',
        //     method:'POST',
        //     data:{
        //         "userId":wx.getStorageSync('userId')
        //     },
        //     success(res){
        //         var todayList=[]
        //         for(var i=0;i<res.data.data.length;i++){
        //             const status=res.data.data[i].status
        //             status==2?todayList.push(res.data.data[i]):null
        //         }
        //         this.setData({
        //             orderlist:res.data.data,
        //             todayOrderList:todayList
        //         })
        //         console.log(this.data.todayOrderList)
        //     }
        //   })
    },

    //点击切换标题
    titleClick: function (e) {
        var type = e.currentTarget.dataset.type
        this.setData({
            current: !this.data.current
        })
    },

    //跳转详情页面
    toOrderDetail: function (e) {
        const index = e.currentTarget.dataset.index
        const orderId = this.data.orderlist[index].id
        console.log(orderId)
        // wx.navigateTo({
        //     url: '/subpackages/orderDetails/index?orderId=' + orderId,
        // })
        wx.navigateTo({
            url: `/subpackages/orderDetails/index?orderId=${orderId}`,
        })
    }


})