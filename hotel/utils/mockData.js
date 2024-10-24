import { i18n } from '../i18n/lang'

const HotelObj = {
    image: '/res/images/ic_hotel_image.png',
    name: i18n['梦之境大酒店'] + ' ',
    service: i18n['停车场'] + '/' + i18n['免费WiFi'],
    address: i18n['时代广场地铁站']
}

const HotelOrder = [{
    hotelName: i18n['梦之境大酒店'] + ' 11',
    startDate: '2024-01-22',
    endDate: '2024-01-25',
    roomName: i18n['标准单人间'],
    roomPrice: '166',
    remark: i18n['远离电梯'],
    name: 'Dreams1',
    phone: '18511111111'
}, {
    hotelName: i18n['梦之境大酒店'] + ' 22',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    roomName: i18n['豪华单人间'],
    roomPrice: '275',
    remark: i18n['无烟房'],
    name: 'Dreams2',
    phone: '18522222222222'
}, {
    hotelName: i18n['梦之境大酒店'] + ' 33',
    startDate: '2024-03-02',
    endDate: '2024-03-10',
    roomName: i18n['标准单人间'],
    roomPrice: '202',
    remark: i18n['高楼层'],
    name: 'Dreams3',
    phone: '18533333333'
}]

const OrderType = [
    i18n["全部"],
    i18n["待入住"],
    i18n["已入住"],
    i18n["已取消"]
]

export default {
  HotelObj,
  HotelOrder,
  OrderType
}