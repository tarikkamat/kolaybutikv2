/**
 * Ödeme isteği (paymentRequest) nesnesini oluşturur.
 * Bu fonksiyon parametre olarak ihtiyaç duyduğu verileri alır
 * ve geri kalan JSON yapısını döndürür.
 *
 * @param {Object} params
 * @param {Array} params.cart
 * @param {Object} params.AddressData
 * @param {Object} params.BillingData
 * @param {string} params.subTotal
 * @param {string} params.total
 * @returns {Object} paymentRequest objesi
 */
export function buildPaymentRequest({cart, AddressData, BillingData, subTotal, total}) {
    return {
        locale: "tr",
        conversationId: "123456789",
        price: subTotal,
        paidPrice: total,
        currency: "TRY",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        callbackUrl: "http://localhost:8000/api/payment/callback",
        buyer: {
            id: "BY789",
            name: BillingData.firstName,
            surname: BillingData.lastName,
            gsmNumber: BillingData.phone,
            email: BillingData.email,
            identityNumber: "74300864791",
            lastLoginDate: "2015-10-05 12:43:35",
            registrationDate: "2013-04-21 15:12:09",
            registrationAddress: AddressData.address,
            ip: "85.34.78.112",
            city: AddressData.city,
            country: AddressData.country,
            zipCode: AddressData.zip,
        },
        shippingAddress: {
            contactName: BillingData.firstName + " " + BillingData.lastName,
            city: AddressData.city,
            country: AddressData.country,
            address: AddressData.address,
            zipCode: AddressData.zip,
        },
        billingAddress: {
            contactName: BillingData.firstName + " " + BillingData.lastName,
            city: AddressData.city,
            country: AddressData.country,
            address: AddressData.address,
            zipCode: AddressData.zip,
        },
        basketItems: cart.map((item) => ({
            id: "BI" + item.id,
            name: item.title,
            category1: "Collectibles",
            category2: "Accessories",
            itemType: "PHYSICAL",
            price: item.price,
        })),
    };
}

export function buildPaymentRequest2({cart, AddressData, BillingData, subTotal, total}) {
    return {
        locale: "tr",
        conversationId: "123456789",
        price: subTotal,
        paidPrice: total,
        currency: "TRY",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        callbackUrl: "http://localhost:8000/api/payment/callback",
        buyer: {
            id: "BY789",
            name: BillingData.firstName,
            surname: BillingData.lastName,
            gsmNumber: BillingData.phone,
            email: BillingData.email,
            identityNumber: "74300864791",
            lastLoginDate: "2015-10-05 12:43:35",
            registrationDate: "2013-04-21 15:12:09",
            registrationAddress: AddressData.address,
            ip: "85.34.78.112",
            city: AddressData.city,
            country: AddressData.country,
            zipCode: AddressData.zip,
        },
        shippingAddress: {
            contactName: BillingData.firstName + " " + BillingData.lastName,
            city: AddressData.city,
            country: AddressData.country,
            address: AddressData.address,
            zipCode: AddressData.zip,
        },
        billingAddress: {
            contactName: BillingData.firstName + " " + BillingData.lastName,
            city: AddressData.city,
            country: AddressData.country,
            address: AddressData.address,
            zipCode: AddressData.zip,
        },
        basketItems: cart.map((item) => ({
            id: "BI" + item.id,
            name: item.title,
            category1: "Collectibles",
            category2: "Accessories",
            itemType: "PHYSICAL",
            price: item.price,
        })),
        paymentCard: {
            cardHolderName: BillingData.firstName + " " + BillingData.lastName,
            cardNumber: "5400010000000004",
            expireMonth: "12",
            expireYear: "2042",
            cvc: "123",
            registerCard: "0",
        }
    };
}