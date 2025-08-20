const steps = [
    {
        id: "welcome-checkout",
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
                text: "Başla",
                action() {
                    return this.next();
                },
            },
        ],
        title: "iyzico Demo Ödeme Sayfasına Hoş Geldiniz!",
        text: ["Test etmek istediğiniz iyzico ürününü seçebilir ve ödeme sürecini deneyimleyebilirsiniz. Bu demo sayfasında gerçek ödeme işlemi yapılmaz."],
    },
    {
        id: "checkout-tab-navigation",
        attachTo: {element: "#checkout-tab-navigation", on: "bottom"},
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
        title: "Adım Navigasyonu",
        text: ["Bu navigasyon çubuğu ile ödeme sürecinin farklı adımları arasında geçiş yapabilirsiniz. Her adım tamamlandığında bir sonraki adıma geçebilirsiniz."],
    },
    {
        id: "billing-info",
        attachTo: {element: "#billing-info-container", on: "bottom"},
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#billing-info-container');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const billingTab = document.querySelector('#checkout-tab-billing-link');
                        if (billingTab) {
                            billingTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
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
        title: "Fatura Bilgileri",
        text: ["Standart e-ticaret sitelerindeki gibi fatura bilgilerinizi alıyoruz. Bu bilgiler ödeme işlemi için gerekli olacak."],
    },
    {
        id: "billing-next-button",
        attachTo: {element: "#billing-actions", on: "right"},
        classes: "shepherd-theme-arrows-fixed",
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
                    // Tab 2'ye geçiş yap
                    const shippingTab = document.querySelector('#checkout-tab-shipping-link');
                    if (shippingTab) {
                        shippingTab.click();
                    }
                    return this.next();
                },
            },
        ],
        title: "İleri Butonu",
        text: ["Fatura bilgilerinizi tamamladıktan sonra 'Teslimat Bilgilerine İlerle' butonuna tıklayarak bir sonraki adıma geçebilirsiniz."],
    },
    {
        id: "shipping-info",
        attachTo: {element: "#shipping-info-container", on: "right"},
        classes: "shepherd-theme-arrows-fixed",
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#shipping-info-container');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const shippingTab = document.querySelector('#checkout-tab-shipping-link');
                        if (shippingTab) {
                            shippingTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
        buttons: [
            {
                text: "Önceki",
                classes: "btn btn-light",
                action() {
                    // Billing tab'ına geri dön
                    const billingTab = document.querySelector('#checkout-tab-billing-link');
                    if (billingTab) {
                        billingTab.click();
                    }
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
        title: "Teslimat Bilgileri",
        text: ["Standart e-ticaret sitelerindeki gibi teslimat bilgilerinizi alıyoruz. Kargo seçeneklerini ve teslimat adresinizi belirleyebilirsiniz."],
    },
    {
        id: "shipping-addresses",
        attachTo: {element: "#shipping-addresses-row", on: "top"},
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#shipping-addresses-row');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const shippingTab = document.querySelector('#checkout-tab-shipping-link');
                        if (shippingTab) {
                            shippingTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
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
        title: "Kayıtlı Adresler",
        text: ["Burada kayıtlı adreslerinizi görebilir ve teslimat için uygun olanı seçebilirsiniz."],
    },
    {
        id: "shipping-methods",
        attachTo: {element: "#shipping-methods-row", on: "top"},
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#shipping-methods-row');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const shippingTab = document.querySelector('#checkout-tab-shipping-link');
                        if (shippingTab) {
                            shippingTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
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
        title: "Gönderim Seçenekleri",
        text: ["Ücretsiz teslimat (3-5 iş günü) veya süper hızlı teslimat (1 iş günü) seçeneklerinden birini seçebilirsiniz."],
    },
    {
        id: "shipping-next-button",
        attachTo: {element: "#shipping-actions", on: "right"},
        classes: "shepherd-theme-arrows-fixed",
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
                    // Tab 3'e geçiş yap
                    const paymentTab = document.querySelector('#checkout-tab-payment-link');
                    if (paymentTab) {
                        paymentTab.click();
                    }
                    return this.next();
                },
            },
        ],
        title: "Ödeme Seçeneklerine İlerle",
        text: ["Teslimat bilgilerinizi tamamladıktan sonra 'Ödeme Seçeneklerine İlerle' butonuna tıklayarak ödeme adımına geçebilirsiniz."],
    },
    {
        id: "payment-section",
        attachTo: {element: "#payment-options-container", on: "right"},
        classes: "shepherd-theme-arrows-fixed",
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#payment-options-container');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const paymentTab = document.querySelector('#checkout-tab-payment-link');
                        if (paymentTab) {
                            paymentTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
        buttons: [
            {
                text: "Önceki",
                classes: "btn btn-light",
                action() {
                    // Shipping tab'ına geri dön
                    const shippingTab = document.querySelector('#checkout-tab-shipping-link');
                    if (shippingTab) {
                        shippingTab.click();
                    }
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
        title: "iyzico Ödeme Dünyasına Hoş Geldiniz!",
        text: ["Bu bölümde iyzico'nun tüm ödeme yöntemlerini test edebilirsiniz. Kredi kartı, banka kartı, taksit seçenekleri ve daha fazlası."],
    },
    {
        id: "payment-methods-overview",
        attachTo: {element: "#payment-methods-row", on: "top"},
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#payment-methods-row');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const paymentTab = document.querySelector('#checkout-tab-payment-link');
                        if (paymentTab) {
                            paymentTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
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
        title: "Ödeme Yöntemleri",
        text: ["iyzico ile kredi kartı, banka kartı, taksit seçenekleri, havale/EFT, kapıda ödeme ve daha birçok ödeme yöntemini kullanabilirsiniz. Her yöntem için ayrı form ve güvenlik önlemleri bulunmaktadır."],
    },
    {
        id: "payment-form",
        attachTo: {element: "#payment-form-card", on: "right"},
        classes: "shepherd-theme-arrows-fixed",
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#payment-form-card');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const paymentTab = document.querySelector('#checkout-tab-payment-link');
                        if (paymentTab) {
                            paymentTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
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
        title: "Ödeme Formu",
        text: ["Seçtiğiniz ödeme yöntemine göre ilgili form burada görüntülenecektir. Güvenli ödeme işlemleri için tüm bilgileriniz şifrelenmiştir."],
    },
    {
        id: "payment-request-view",
        attachTo: {element: "#payment-request-button-container", on: "right"},
        classes: "shepherd-theme-arrows-fixed",
        beforeShowPromise: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    // Element'in var olup olmadığını kontrol et
                    const element = document.querySelector('#payment-request-button-container');
                    if (!element) {
                        // Element yoksa tab'ı tekrar tıkla
                        const paymentTab = document.querySelector('#checkout-tab-payment-link');
                        if (paymentTab) {
                            paymentTab.click();
                        }
                    }
                    setTimeout(resolve, 200);
                }, 100);
            });
        },
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
        title: "Ödeme İsteği Görüntüle",
        text: ["Seçtiğiniz ödeme yöntemi için oluşturulan ödeme isteğini buradan görüntüleyebilirsiniz. Bu, iyzico'ya gönderilecek teknik verileri içerir."],
    },
    {
        id: "demo-note",
        title: "Demo Notu",
        text: ["Bu sayfa tamamen demo amaçlıdır. Gerçek ödeme işlemi yapılmaz. iyzico entegrasyonunu test etmek ve ödeme akışını deneyimlemek için tasarlanmıştır. İyi testler!"],
    },
];

export default steps; 