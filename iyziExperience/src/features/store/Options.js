import {Col, Input, Label, Row} from "reactstrap";
import React from "react";

const Options = ({selectedView, setSelectedView}) => {
    return (
        <Row className="g-4 mb-3" id="marketOptions">
            <Col lg={4}>
                <div className="form-check card-radio">
                    <Input id="standartView" name="storeViev" type="radio" className="form-check-input" checked={selectedView === 1}
                           onChange={() => setSelectedView(1)}/>
                    <Label className="form-check-label" htmlFor="standartView">
                        <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">Standart</span>
                        <span className="fs-14 mb-1 text-wrap d-block">Bu sekmeden standart alışveriş deneyimi yaşayabilirsiniz.</span>
                        <span className="text-muted fw-normal text-wrap d-block">Non3Ds, 3Ds, Checkout-Form, Pay with iyzico</span>
                    </Label>
                </div>
            </Col>
            <Col lg={4}>
                <div className="form-check card-radio">
                    <Input id="subscriptionView" name="storeViev" type="radio" className="form-check-input" checked={selectedView === 2}
                           onChange={() => setSelectedView(2)} disabled/>
                    <Label className="form-check-label" htmlFor="subscriptionView" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">Abonelik</span>
                        <span className="fs-14 mb-1 text-wrap d-block">Bu sekmeden abonelik ürününü deneyimleyebilirsiniz.</span>
                        <span
                            className="text-muted fw-normal text-wrap d-block">Non3Ds, Checkout-Form</span>
                    </Label>
                </div>
            </Col>
            <Col lg={4}>
                <div className="form-check card-radio">
                    <Input id="marketplaceView" name="storeViev" type="radio" className="form-check-input" checked={selectedView === 3}
                           onChange={() => setSelectedView(3)} disabled/>
                    <Label className="form-check-label" htmlFor="marketplaceView" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">Pazaryeri</span>
                        <span className="fs-14 mb-1 text-wrap d-block">Bu sekmeden pazaryeri ürününü deneyimleyebilirsiniz.</span>
                        <span className="text-muted fw-normal text-wrap d-block">Non3Ds, 3Ds, Checkout-Form, Pay with iyzico</span>
                    </Label>
                </div>
            </Col>
        </Row>
    )
}

export default Options