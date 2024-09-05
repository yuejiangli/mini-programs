import i18n from '../../i18n/index';
Page({
    data:{
        remarks: "",
        lang:{
            placeholder:i18n.t('口味、包装等要求'),
            buttonText:i18n.t('提交'),
        }
    },

    onLoad:function(){
        const remarks=wx.getStorageSync('remarks')
        this.setData({
            remarks:remarks
        })
    },

    //提交备注
    confirm:function(){
        wx.setStorageSync('remarks', this.data.remarks)
        wx.navigateBack({
            delta:1
        })
    },

    //输入备注
    inputRemarks:function(e){
        var remarks=e.detail.value
        this.setData({
            remarks:remarks,
            remarkLength:remarks.length
        })
    }
})