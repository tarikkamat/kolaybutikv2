// src/pages/Index/components/ShippingInfo.js
import React from "react";
import {Col, Input, Label, Row} from "reactstrap";
import DummyData from "../data/dummy_data";
import {useSelector} from "react-redux";
import ToastAlert from "../../../Components/Common/ToastAlert";

const ShippingInfo = ({
                          toggleTab,
                          activeTab,
                          shippingMethod,
                          setShippingMethod
                      }) => {
    const {AddressData, BillingData} = DummyData;
    const {cart} = useSelector((state) => state.Cart);

    const handleNextStep = () => {
        if (!cart || cart.length === 0) {
            ToastAlert("Sepetinizde ürün bulunmamaktadır.", "error");
            return;
        }
        toggleTab(activeTab + 1);
    };

    return (
        <div id="shipping-info-container">
            <div id="shipping-info-header">
                <h5 className="mb-1" id="shipping-info-title">Teslimat Bilgileri</h5>
                <p className="text-muted mb-4" id="shipping-info-description">
                    Lütfen aşağıdaki bilgileri doldurun
                </p>
            </div>

            <div className="mt-4" id="shipping-info-content">
                <div className="d-flex align-items-center mb-2" id="shipping-addresses-header">
                    <div className="flex-grow-1">
                        <h5 className="fs-14 mb-0" id="shipping-addresses-title">Kayıtlı Adreslerim</h5>
                    </div>
                </div>
                <Row className="gy-3" id="shipping-addresses-row">
                    <Col lg={4} sm={6}>
                        <div className="form-check card-radio" id="shipping-address-container">
                            <Input
                                id="shippingAddress01"
                                name="shippingAddress"
                                type="radio"
                                className="form-check-input"
                                defaultChecked
                            />
                            <Label className="form-check-label" htmlFor="shippingAddress01">
                                <span className="mb-4 fw-semibold d-block text-muted text-uppercase">
                                    Ev Adresim
                                </span>
                                <span className="fs-14 mb-2 d-block">
                                    {BillingData.firstName + " " + BillingData.lastName}
                                </span>
                                <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                    {`${AddressData.address}, ${AddressData.zip} ${AddressData.city}, ${AddressData.country}`}
                                </span>
                                <span className="text-muted fw-normal d-block">
                                    Tel. {BillingData.phone}
                                </span>
                            </Label>
                        </div>
                    </Col>
                </Row>

                <div className="mt-4" id="shipping-methods-section">
                    <h5 className="fs-14 mb-3" id="shipping-methods-title">Gönderim Seçenekleri</h5>
                    <Row className="g-4" id="shipping-methods-row">
                        <Col lg={6}>
                            <div className="form-check card-radio" id="shipping-method-free-container">
                                <Input
                                    id="shippingMethod01"
                                    name="shippingMethod"
                                    type="radio"
                                    className="form-check-input"
                                    checked={shippingMethod === 1}
                                    onChange={() => setShippingMethod(1)}
                                />
                                <Label
                                    className="form-check-label"
                                    htmlFor="shippingMethod01"
                                >
                                    <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">
                                        Ücretsiz
                                    </span>
                                    <span className="fs-14 mb-1 text-wrap d-block">
                                        Ücretsiz Teslimat
                                    </span>
                                    <span className="text-muted fw-normal text-wrap d-block">
                                        Tahmini teslim 3 ila 5 iş günü
                                    </span>
                                </Label>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="form-check card-radio" id="shipping-method-fast-container">
                                <Input
                                    id="shippingMethod02"
                                    name="shippingMethod"
                                    type="radio"
                                    className="form-check-input"
                                    checked={shippingMethod === 2}
                                    onChange={() => setShippingMethod(2)}
                                />
                                <Label
                                    className="form-check-label"
                                    htmlFor="shippingMethod02"
                                >
                                    <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">
                                        24.99<span className="ms-1">₺</span>
                                    </span>
                                    <span className="fs-14 mb-1 text-wrap d-block">
                                        Süper Hızlı Teslimat
                                    </span>
                                    <span className="text-muted fw-normal text-wrap d-block">
                                        Tahmini teslim 1 iş günü
                                    </span>
                                </Label>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="d-flex align-items-start gap-3 mt-4" id="shipping-actions">
                <button
                    type="button"
                    className="btn btn-light btn-label previestab"
                    id="shipping-back-button"
                    onClick={() => toggleTab(activeTab - 1)}
                >
                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                    Fatura Bilgilerine Geri Dön
                </button>
                <button
                    type="button"
                    className={`btn btn-label right ms-auto nexttab ${!cart || cart.length === 0 ? 'btn-light text-muted' : 'btn-primary'}`}
                    id="shipping-next-button"
                    onClick={handleNextStep}
                >
                    <i className={`ri-bank-card-line label-icon align-middle fs-16 ms-2 ${!cart || cart.length === 0 ? 'text-muted' : ''}`}></i>
                    Ödeme Seçeneklerine İlerle
                </button>
            </div>
        </div>
    );
};

export default ShippingInfo;