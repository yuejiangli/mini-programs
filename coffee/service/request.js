import i18n from '../i18n/index';
const noi18n = v => v;
// 获取店铺列表
export const getStoreList = () => {
    return [
        {
            id: 19973,
            address: noi18n('Shop 10-16, 1/F, Bank Centre Mall, Hong Kong'),
            isShowToYou: true,
            isCollection: 0,
            storeName: noi18n('Bank Centre Mall'),
            status: 1,
            distance: 0.80,
            hotLine: '+852 2953 0225',
            beginTime: '07:00:00',
            endTime: '22:00:00',
        },
        {
            id: 69363,
            address: noi18n('Shop No. 2, Level 4A, Langham Place, Kowloon'),
            isShowToYou: true,
            isCollection: 1,
            storeName: noi18n('Langham Place'),
            status: 0,
            distance: 1.20,
            hotLine: '+852 3165 8182',
            beginTime: "07:30:00",
            endTime: "22:00:00",
        },
        {
            id: 53430,
            address: noi18n('Kiosk A & B, 2/F, Pioneer Centre, Kowloon'),
            isShowToYou: true,
            isCollection: 1,
            storeName: noi18n('Pioneer Centre'),
            status: 1,
            distance: 1.10,
            hotLine: '+852 2625 9172',
            beginTime: "07:30:00",
            endTime: "20:00:00",
        },
        {
            id: 78430,
            address: noi18n('Shop B01, Basement, Gala Place, 56, Hong Kong'),
            isShowToYou: true,
            isCollection: 1,
            storeName: noi18n('Gala Place'),
            status: 1,
            distance: 0.40,
            hotLine: '+852 2613 2921',
            beginTime: "07:30:00",
            endTime: "20:00:00",
        },
        {
            id: 79230,
            address: noi18n('Shop 247, 2, Moko 193 Prince Edward Rd W, Hong Kong'),
            isShowToYou: true,
            isCollection: 1,
            storeName: noi18n('MOKO'),
            status: 1,
            distance: 1.60,
            hotLine: '+852 2662 9023',
            beginTime: "07:30:00",
            endTime: "20:00:00",
        },
    ]
}

// 获取商品列表
export const getProductList = () => {
    return [
        {
            id: 1,
            number: 0,
            price: 16,
            productName: noi18n('Tropical Citrus Iced Energy'),
            detailRemarks: noi18n('A sparkling boost of sugar-free energy, chilled to perfection. Refreshing flavors of passionfruit and citrus balanced with bright, mint-tinted green tea, served over ice. The ultimate afternoon jump start. 205 mg caffeine.'),
            imgUrl: '../../static/img/coffee/0.jpg'
        },
        {
            id: 2,
            number: 0,
            price: 18,
            productName: noi18n('Melon Burst Iced Energy'),
            detailRemarks: noi18n('A sparkling boost of sugar-free energy, chilled to perfection. Refreshing flavors of melon and cucumber balanced with bright Passion Tango tea, served over ice. The ultimate afternoon jump start. 180 mg caffeine.'),
            imgUrl: '../../static/img/coffee/1.jpg'
        },
        {
            id: 3,
            number: 0,
            price: 36,
            productName: noi18n('Pumpkin Cream Cold Brew'),
            detailRemarks: noi18n('Starbucks Cold Brew sweetened with vanilla syrup and topped with pumpkin cream cold foam and a dusting of pumpkin-spice topping.'),
            imgUrl: '../../static/img/coffee/2.jpg'
        },
        {
            id: 4,
            number: 0,
            price: 22,
            productName: noi18n('Mocha Cookie Crumble Frappuccino'),
            detailRemarks: noi18n('Frappuccino Roast coffee, mocha sauce and Frappuccino chips blended with milk and ice, layered on top of whipped cream and chocolate cookie crumble and topped with vanilla whipped cream, mocha drizzle and even more chocolate cookie crumble. Each sip is as good as the last . . . all the way to the end.'),
            imgUrl: '../../static/img/coffee/3.jpg'
        },
        {
            id: 5,
            number: 0,
            price: 34,
            productName: noi18n('Summer-Berry Starbucks Refreshers Beverage'),
            detailRemarks: noi18n('A sweet summer blend of raspberry, blueberry and blackberry flavors, shaken with ice and poured over raspberry flavored pearls that deliver a delicate and deliciously sweet burst of summer fun.'),
            imgUrl: '../../static/img/coffee/4.jpg'
        },
        {
            id: 6,
            number: 0,
            price: 28,
            productName: noi18n('Featured Dark Roast'),
            detailRemarks: noi18n('This full-bodied dark roast coffee has the bold, robust flavors to showcase our roasting and blending artistry.'),
            imgUrl: '../../static/img/coffee/5.jpg'
        },
        {
            id: 7,
            number: 0,
            price: 24,
            productName: noi18n('Hot Chocolate'),
            detailRemarks: noi18n('Steamed milk with chocolate-flavored syrups. Topped with sweetened whipped cream and chocolate-flavored drizzle. A timeless classic made to sweeten your spirits.'),
            imgUrl: '../../static/img/coffee/6.jpg'
        },
    ]
}