// src/pages/Index/components/PaymentOptions.js
import React from "react";
import {Card, Col, Input, Label, Row} from "reactstrap";
import {useSelector} from "react-redux";
import ToastAlert from "../../../Components/Common/ToastAlert";
import CreditCardForm from "../payment_forms/CreditCardForm";
import SavedCardForm from "../payment_forms/SavedCardForm";
import CheckoutForm from "../payment_forms/CheckoutForm";
import QuickPwiForm from "../payment_forms/QuickPwiForm";
import ApmForm from "../payment_forms/ApmForm";

const PaymentOptions = ({
    toggleTab,
    activeTab,
    paymentMethod,
    setPaymentMethod,
    toggleModal,
    paymentRequest,
    paymentRequest2,
    paymentState,
    onPaymentStart,
    onPaymentComplete
}) => {
    const {cart} = useSelector((state) => state.Cart);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        if (method === 1 || method === 2 || method === 3) {
            onPaymentStart?.();
        }
    };

    const handleNextStep = () => {
        if (!cart || cart.length === 0) {
            ToastAlert("Sepetinizde ürün bulunmamaktadır.", "error");
            return;
        }
        toggleTab(activeTab + 1);
    };

    function paymentMethodView(paymentMethod) {
        // Only render forms if we're on the payment tab (activeTab === 3)
        // This prevents unnecessary script loading when forms are not visible
        if (activeTab !== 3) {
            return (
                <div className="text-center p-4">
                    <p className="text-muted">Ödeme seçenekleri burada görüntülenecek</p>
                </div>
            );
        }

        switch (paymentMethod) {
            case 1:
                if (!paymentRequest || !paymentState?.formKey) {
                    return (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Hazırlanıyor...</span>
                            </div>
                        </div>
                    );
                }
                return (
                    <>
                    <QuickPwiForm
                        key={`checkout-form-${paymentState?.formKey}`}
                        paymentRequest={paymentRequest}
                        paymentState={paymentState}
                        onPaymentStart={onPaymentStart}
                        onPaymentComplete={onPaymentComplete}
                    />
                    <CreditCardForm 
                        paymentRequest={paymentRequest2}
                        onPaymentStart={onPaymentStart}
                        onPaymentComplete={onPaymentComplete}
                    />
                    </>
                );
            case 2:
                // CheckoutForm sadece gerekli props'lar hazır olduğunda render et
                if (!paymentRequest || !paymentState?.formKey) {
                    return (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Hazırlanıyor...</span>
                            </div>
                        </div>
                    );
                }
                return (
                    <CheckoutForm
                        key={`checkout-form-${paymentState?.formKey}`}
                        paymentRequest={paymentRequest}
                        paymentState={paymentState}
                        onPaymentStart={onPaymentStart}
                        onPaymentComplete={onPaymentComplete}
                    />
                );
            case 3:
                if (!paymentRequest) {
                    return (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Hazırlanıyor...</span>
                            </div>
                        </div>
                    );
                }
                return (
                    <ApmForm
                        key={`apm-form-${paymentState?.formKey || 'initial'}`}
                        paymentRequest={paymentRequest}
                        paymentState={paymentState}
                        onPaymentStart={onPaymentStart}
                        onPaymentComplete={onPaymentComplete}
                    />
                );
            case 4:
                return (
                    <SavedCardForm 
                        paymentRequest={paymentRequest2}
                        onPaymentStart={onPaymentStart}
                        onPaymentComplete={onPaymentComplete}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div id="payment-options-container">
            <div id="payment-options-header">
                <h5 className="mb-1" id="payment-options-title">Ödeme Seçenekleri</h5>
                <p className="text-muted mb-4" id="payment-options-description">Lütfen aşağıdaki bilgileri doldurun</p>
            </div>

            <Row className="g-4" id="payment-methods-row">
                <Col lg={3} sm={6}>
                    <div className="form-check card-radio" id="payment-method-credit-container">
                        <Input
                            id="paymentMethod02"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                            checked={paymentMethod === 1}
                            onChange={() => handlePaymentMethodChange(1)}
                        />
                        <Label className="form-check-label" htmlFor="paymentMethod02">
                            <span className="fs-16 text-muted me-2">
                                <i className="ri-lock-line align-bottom"></i>
                            </span>
                            <span className="fs-14 text-wrap">Kredi Kartı</span>
                        </Label>
                    </div>
                </Col>

                <Col lg={3} sm={6}>
                    <div className="form-check card-radio" id="payment-method-checkout-container">
                        <Input
                            id="paymentMethod03"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                            checked={paymentMethod === 2}
                            onChange={() => handlePaymentMethodChange(2)}
                        />
                        <Label className="form-check-label" htmlFor="paymentMethod03">
                            <span className="fs-16 text-muted me-2">
                                <i className="ri-pages-line align-bottom"></i>
                            </span>
                            <span className="fs-14 text-wrap">CheckoutForm</span>
                        </Label>
                    </div>
                </Col>

                <Col lg={3} sm={6}>
                    <div className="form-check card-radio" id="payment-method-pwi-container">
                        <Input
                            id="paymentMethod04"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                            checked={paymentMethod === 3}
                            onChange={() => handlePaymentMethodChange(3)}
                        />
                        <Label className="form-check-label" htmlFor="paymentMethod04">
                            <span className="fs-16 text-muted me-2">
                                <i className="ri-wallet-line align-bottom"></i>
                            </span>
                            <span className="fs-14 text-wrap">Pay with iyzico</span>
                        </Label>
                    </div>
                </Col>

                <Col lg={3} sm={6}>
                    <div className="form-check card-radio" id="payment-method-saved-container">
                        <Input
                            id="paymentMethod05"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                            checked={paymentMethod === 4}
                            onChange={() => handlePaymentMethodChange(4)}
                        />
                        <Label className="form-check-label" htmlFor="paymentMethod05">
                            <span className="fs-16 text-muted me-2">
                                <i className="ri-bank-card-2-line align-bottom"></i>
                            </span>
                            <span className="fs-14 text-wrap">Saklı Kartlarım</span>
                        </Label>
                    </div>
                </Col>
            </Row>

            <div className="collapse show" id="paymentmethodCollapse">
                <Card className="p-4 border shadow-none mb-0 mt-4" id="payment-form-card">
                    <Row className="gy-3" id="payment-form-row">
                        {paymentMethodView(paymentMethod)}
                    </Row>
                </Card>
                <div className="text-muted mt-2 fst-italic" id="payment-security-note">
                    <i data-feather="lock" className="text-muted icon-xs"></i>
                    Güvenli ödeme işlemleri için tüm bilgileriniz şifrelenmiştir.
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center gap-3 mt-4" id="payment-actions">
                <button
                    type="button"
                    className="btn btn-light btn-label previestab"
                    id="payment-back-button"
                    onClick={() => toggleTab(activeTab - 1)}
                >
                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                    Teslimat Bilgilerine Geri Dön
                </button>
                <div id="payment-request-button-container">
                    <button
                        type="button"
                        className="btn btn-warning btn-label me-2"
                        id="payment-request-view-button"
                        onClick={() => toggleModal(paymentMethod)}
                    >
                        <i className="ri-code-s-slash-line label-icon align-middle fs-16 me-2"></i>
                        Ödeme İsteği Görüntüle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentOptions;