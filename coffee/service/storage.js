// 当前用户信息
export const saveUserInfo = (userInfo) => {
    wx.setStorageSync('userInfo', userInfo)
}
export const getUserInfo = () => {
    return wx.getStorageSync('userInfo')
}

// 当前店铺信息
export const saveStoreInfo = (storeInfo) => {
    wx.setStorageSync('storeInfo', storeInfo)
}
export const getStoreInfo = () => {
    return wx.getStorageSync('storeInfo')
}

// 当前购物车数据
export const saveShoppingCar = (shoppingCar) => {
    wx.setStorageSync('shoppingCar', shoppingCar)
}
export const getShoppingCar = () => {
    return wx.getStorageSync('shoppingCar')
}

// 订单信息
export const getOrderList = () => {
    return wx.getStorageSync('orderList') || []
}
export const getOrderInfo = (orderId) => {
    const list = getOrderList()
    const orderInfo = list.find(item => item.id === orderId)
    return orderInfo
}
export const saveOrderInfo = (orderInfo) => {
    const list = getOrderList()
    wx.setStorageSync('orderList', [...list, orderInfo])
    return orderInfo.id;
}

export const clearAll = () => {
    wx.clearStorageSync();
}