import React, {useState} from 'react'
import {Card, CardBody, Col, Container, Row} from 'reactstrap'

const Plans = () => {
    const [isYearly, setIsYearly] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const plans = [
        {id: 1, name: "Birinci Plan", price: {monthly: 19, yearly: 182}, features: ["Özellik 1", "Özellik 2", "Özellik 3"]},
        {id: 2, name: "İkinci Plan", price: {monthly: 29, yearly: 278}, features: ["Özellik 1", "Özellik 2", "Özellik 3"], isPopular: true},
        {id: 3, name: "Üçüncü Plan", price: {monthly: 39, yearly: 374}, features: ["Özellik 1", "Özellik 2", "Özellik 3"]},
    ]

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId)
        console.log("planId: ", planId)
    }

    const toggle = () => setIsYearly(!isYearly)

    return (
        <React.Fragment>
            <div className="bg-white w-100 mt-3">
                <Container className="py-5">
                    <CardBody className="p-4">
                        <Row className="justify-content-center">
                            <Col lg={8}>
                                <div className="text-center mb-5">
                                    <h3 className="mb-3 fw-semibold">Size uygun planı seçin</h3>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h5 className={`fs-14 mb-0 ${!isYearly ? 'text-primary' : ''}`}>Aylık</h5>
                                        <div className="form-check form-switch fs-20 mx-3" onClick={toggle}>
                                            <input className="form-check-input" type="checkbox" id="plan-switch" checked={isYearly} readOnly/>
                                            <label className="form-check-label" htmlFor="plan-switch"></label>
                                        </div>
                                        <h5 className={`fs-14 mb-0 ${isYearly ? 'text-primary' : ''}`}>
                                            Yıllık <span className="badge bg-success-subtle text-success">Kazanç %20</span>
                                        </h5>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="gy-4 justify-content-center">
                            {plans.map((plan) => (
                                <Col lg={4} md={6} key={plan.id}>
                                    <Card
                                        className={`plan-box mb-0 ${plan.isPopular ? 'ribbon-box right' : ''}`}
                                        onClick={() => handlePlanSelect(plan.id)}
                                        style={{
                                            cursor: 'pointer',
                                            border: selectedPlan === plan.id ? '2px solid #405189' : '1px solid #e9ebec',
                                            backgroundColor: selectedPlan === plan.id ? '#e0e7ff' : '#f8f9fa',
                                            transition: 'all 0.3s ease',
                                            boxShadow: selectedPlan === plan.id ? '0 0 15px rgba(64, 81, 137, 0.1)' : 'none',
                                        }}
                                    >
                                        <CardBody className="p-4 m-2">
                                            {plan.isPopular && (
                                                <div className="ribbon-two ribbon-two-danger"><span>Popüler</span></div>
                                            )}
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-1 fw-semibold">{plan.name}</h5>
                                                </div>
                                                <div className="avatar-sm">
                                                    <div className="avatar-title bg-light rounded-circle text-primary">
                                                        <i className={`ri-${plan.id === 1 ? 'book-mark-line' : plan.id === 2 ? 'medal-fill' : 'stack-fill'} fs-20`}></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-4 text-center">
                                                <h1 className="month">
                                                        <span className="ff-secondary fw-bold">
                                                            {isYearly ? plan.price.yearly : plan.price.monthly}
                                                        </span>
                                                    <sup><small>₺</small></sup>
                                                    <span className="fs-13 text-muted">/{isYearly ? 'Yıllık' : 'Aylık'}</span>
                                                </h1>
                                            </div>
                                            <div>
                                                <ul className="list-unstyled text-muted vstack gap-3 ff-secondary">
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index}>
                                                            <div className="d-flex">
                                                                <div className={`flex-shrink-0 text-${index < 2 || plan.id === 3 ? 'success' : 'danger'} me-1`}>
                                                                    <i className={`ri-${index < 2 || plan.id === 3 ? 'checkbox-circle-fill' : 'close-circle-fill'} fs-15 align-middle`}></i>
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    {feature}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <div className="btn btn-primary w-100" onClick={() => console.log(`Selected plan: ${selectedPlan}`)}>
                                    Seçili Olanı Sepete Ekle
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Plans