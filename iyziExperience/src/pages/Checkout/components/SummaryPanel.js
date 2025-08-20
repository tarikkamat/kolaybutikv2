// src/pages/Index/components/SummaryPanel.js
import React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";

const SummaryPanel = ({
                          cart,
                          calculateSubTotal,
                          shippingCharge,
                          taxRate,
                          calculateTotal
                      }) => {
    return (
        <Card id="summary-panel-card">
            <CardHeader id="summary-panel-header">
                <div className="d-flex" id="summary-panel-header-content">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0" id="summary-panel-title">Sepet Özeti</h5>
                    </div>
                </div>
            </CardHeader>
            <CardBody id="summary-panel-body">
                <div className="table-responsive table-card" id="summary-panel-table-container">
                    <table className="table table-borderless align-middle mb-0" id="summary-panel-table">
                        <thead className="table-light text-muted" id="summary-panel-table-header">
                        <tr id="summary-panel-table-header-row">
                            <th style={{width: "90px"}} scope="col" id="summary-panel-image-header">Resim</th>
                            <th scope="col" id="summary-panel-product-header">Ürün</th>
                            <th scope="col" className="text-end" id="summary-panel-price-header">Fiyat</th>
                        </tr>
                        </thead>
                        <tbody id="summary-panel-table-body">
                        {cart.map((item, key) => (
                            <React.Fragment key={key}>
                                <tr id={`summary-panel-item-${key}`}>
                                    <td id={`summary-panel-item-image-${key}`}>
                                        <div className="avatar-md bg-light rounded p-1" id={`summary-panel-item-image-container-${key}`}>
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="img-fluid d-block"
                                                id={`summary-panel-item-image-img-${key}`}
                                            />
                                        </div>
                                    </td>
                                    <td id={`summary-panel-item-details-${key}`}>
                                        <h5 className="fs-14" id={`summary-panel-item-title-${key}`}>{item.title}</h5>
                                        <p className="text-muted mb-0" id={`summary-panel-item-price-info-${key}`}>
                                            {item.price}
                                            <span className="ms-1">₺</span> x {item.quantity}
                                        </p>
                                    </td>
                                    <td className="text-end" id={`summary-panel-item-total-${key}`}>
                                        {(item.price * item.quantity).toFixed(2)}
                                        <span className="ms-1">₺</span>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                        <tr id="summary-panel-subtotal-row">
                            <td className="fw-semibold mt-1" colSpan="2" id="summary-panel-subtotal-label">
                                Ara Toplam:
                            </td>
                            <td className="fw-semibold text-end" id="summary-panel-subtotal-value">
                                {calculateSubTotal()}
                                <span className="ms-1">₺</span>
                            </td>
                        </tr>
                        <tr id="summary-panel-shipping-row">
                            <td colSpan="2" id="summary-panel-shipping-label">Teslimat Bedeli:</td>
                            <td className="text-end" id="summary-panel-shipping-value">
                                {shippingCharge.toFixed(2)}
                                <span className="ms-1">₺</span>
                            </td>
                        </tr>
                        <tr id="summary-panel-tax-row">
                            <td colSpan="2" id="summary-panel-tax-label">KDV (%20):</td>
                            <td className="text-end" id="summary-panel-tax-value">
                                {(
                                    parseFloat(calculateSubTotal()) * taxRate
                                ).toFixed(2)}
                                <span className="ms-1">₺</span>
                            </td>
                        </tr>
                        <tr className="table-active" id="summary-panel-total-row">
                            <th colSpan="2" id="summary-panel-total-label">Toplam (TRY):</th>
                            <td className="text-end" id="summary-panel-total-value">
                  <span className="fw-semibold" id="summary-panel-total-amount">
                    {calculateTotal()}
                      <span className="ms-1">₺</span>
                  </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
};

export default SummaryPanel;