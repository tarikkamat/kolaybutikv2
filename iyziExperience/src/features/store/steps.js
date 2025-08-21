const steps = [
    {
        id: "choose-market",
        attachTo: {element: "#marketOptions", on: "bottom"},
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    window.scrollTo(0, 0);
                    resolve();
                }, 500);
            });
        },
        buttons: [
            {
                classes: "btn btn-light",
                text: "Vazgeç",
                action() {
                    return this.cancel();
                },
            },
            {
                text: "Sonraki",
                action() {
                    return this.next();
                },
            },
        ],
        title: "Hoş geldin!",
        text: ["Burası önemli, abonelik veya pazaryeri ürünlerini denemek seçim yapabilirsiniz."],
    },
    {
        id: "product-add-tour",
        attachTo: {element: "#addCart", on: "bottom"},
        buttons: [
            {
                text: "Önceki",
                classes: "btn btn-light",
                action() {
                    return this.back();
                },
            },
            {
                text: "Sonraki",
                action() {
                    return this.next();
                },
            },
        ],
        title: "Ürün Ekleme",
        text: ["Buradan ürünü sepete ekleyebilirsiniz."],
    },
    {
        id: "cart-view-tour",
        attachTo: {element: "#mycartdropdown", on: "bottom"},
        buttons: [
            {
                text: "Önceki",
                classes: "btn btn-light",
                action() {
                    return this.back();
                },
            },
            {
                text: "Sonraki",
                action() {
                    return this.next();
                },
            },
        ],
        title: "Sepetim",
        text: ["Sepetinizi burada görebilirsiniz."],
    },
    {
        id: "thankyou-tour",
        title: "Teşekkürler!",
        text: ["Demo sayfamızı ziyaret ettiğiniz için teşekkür ederiz. İyi günler!"],
    },
];

export default steps;
