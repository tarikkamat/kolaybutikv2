import React from "react";
import {Col, Input, Label, Row} from "reactstrap";
import DummyData from "../data/dummy_data";

const BillingInfo = ({toggleTab, activeTab}) => {
    const {AddressData, BillingData} = DummyData;
    
    return (
        <div id="billing-info-container">
            <div id="billing-info-header">
                <h5 className="mb-1" id="billing-info-title">Fatura Bilgileri</h5>
                <p className="text-muted mb-4" id="billing-info-description">
                    Lütfen aşağıdaki bilgileri doldurun
                </p>
            </div>

            <div id="billing-info-form">
                <Row id="billing-name-row">
                    <Col sm={6}>
                        <div className="mb-3" id="billing-firstname-container">
                            <Label htmlFor="billinginfo-firstName" className="form-label">Ad</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="billinginfo-firstName"
                                defaultValue={BillingData.firstName}
                                disabled
                            />
                        </div>
                    </Col>

                    <Col sm={6}>
                        <div className="mb-3" id="billing-lastname-container">
                            <Label htmlFor="billinginfo-lastName" className="form-label">Soyad</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="billinginfo-lastName"
                                defaultValue={BillingData.lastName}
                                disabled
                            />
                        </div>
                    </Col>
                </Row>

                <Row id="billing-contact-row">
                    <Col sm={6}>
                        <div className="mb-3" id="billing-email-container">
                            <Label htmlFor="billinginfo-email" className="form-label">E-posta</Label>
                            <Input
                                type="email"
                                className="form-control"
                                id="billinginfo-email"
                                defaultValue={BillingData.email}
                                disabled
                            />
                        </div>
                    </Col>

                    <Col sm={6}>
                        <div className="mb-3" id="billing-phone-container">
                            <Label htmlFor="billinginfo-phone" className="form-label">Telefon</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="billinginfo-phone"
                                defaultValue={BillingData.phone}
                                disabled
                            />
                        </div>
                    </Col>
                </Row>

                <div className="mb-3" id="billing-address-container">
                    <Label htmlFor="billinginfo-address" className="form-label">Adres</Label>
                    <textarea
                        className="form-control"
                        id="billinginfo-address"
                        rows="3"
                        disabled
                        defaultValue={AddressData.address}
                    />
                </div>

                <Row id="billing-location-row">
                    <Col md={4}>
                        <div className="mb-3" id="billing-country-container">
                            <Label htmlFor="addressinfo-country" className="form-label">Ülke</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="addressinfo-country"
                                defaultValue={AddressData.country}
                                disabled
                            />
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className="mb-3" id="billing-city-container">
                            <Label htmlFor="addressinfo-city" className="form-label">Şehir</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="addressinfo-city"
                                defaultValue={AddressData.city}
                                disabled
                            />
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className="mb-3" id="billing-zip-container">
                            <Label htmlFor="addressinfo-zip" className="form-label">Posta Kodu</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="addressinfo-zip"
                                defaultValue={AddressData.zip}
                                disabled
                            />
                        </div>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end align-items-center gap-2 mt-3" id="billing-actions">
                    <button
                        type="button"
                        className="btn btn-primary btn-label nexttab"
                        id="billing-next-button"
                        onClick={() => toggleTab(activeTab + 1)}
                    >
                        <i className="ri-truck-line label-icon align-middle fs-16 me-2"></i>
                        Teslimat Bilgilerine İlerle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingInfo;