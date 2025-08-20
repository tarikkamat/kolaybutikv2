// src/pages/Checkout/Checkout.js
import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {Card, CardBody, Col, Container, Form, Nav, NavItem, NavLink, Row, TabContent, TabPane,} from "reactstrap";
import classnames from "classnames";
import ToastAlert from "../../Components/Common/ToastAlert";
import {useLocation} from "react-router-dom";
import { useGlobalTour } from "../../Components/Context/TourContext";

// Data ve Bileşenler
import DummyData from "./data/dummy_data";
import RequestViewModal from "./components/RequestViewModal";
import BillingInfo from "./components/BillingInfo";
import ShippingInfo from "./components/ShippingInfo";
import PaymentOptions from "./components/PaymentOptions";
import Confirmation from "./components/Confirmation";
import SummaryPanel from "./components/SummaryPanel";

// Hesaplama ve Payment Request fonksiyonları
import {calculateSubTotal, calculateTotal} from "./utils/calculate";
import {buildPaymentRequest, buildPaymentRequest2} from "./utils/request";

const Checkout = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [modalOpen, setModalOpen] = useState(false);
    const { autoStartTour } = useGlobalTour();
    const [paymentState, setPaymentState] = useState({
        method: null,
        formKey: Date.now(), // Form'u yeniden yüklemek için unique key
        isProcessing: false
    });
    const [paymentResult, setPaymentResult] = useState(null);

    const {AddressData, BillingData} = DummyData;
    const {cart} = useSelector((state) => state.Cart);

    const [shippingMethod, setShippingMethod] = useState(2);
    const [paymentMethod, setPaymentMethod] = useState(1);

    // Kargo ve vergi oranları
    const shippingCharge = shippingMethod === 1 ? 0 : 24.99;
    const taxRate = 0.2;

    // Adım geçişlerini yönetmek için
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            // Ödeme tabına geçiş kontrolü
            if (tab === 3 && (!cart || cart.length === 0)) {
                ToastAlert("Sepetinizde ürün bulunmamaktadır.", "error");
                return;
            }

            const modifiedSteps = [...passedSteps, tab];
            if (tab >= 1 && tab <= 4) {
                setActiveTab(tab);
                setPassedSteps(modifiedSteps);
            }
        }
    };

    const toggleModal = (method = null) => {
        setModalOpen(!modalOpen);
        // Eğer method parametresi geçilmişse, payment method'u güncelle
        if (method !== null) {
            setPaymentMethod(method);
        }
    };

    // Subtotal ve total hesaplama
    const subTotal = calculateSubTotal(cart);
    const total = calculateTotal(cart, shippingCharge, taxRate);

    // Payment Request
    const paymentRequest = buildPaymentRequest({
        cart,
        AddressData,
        BillingData,
        subTotal,
        total,
    });

    const paymentRequest2 = buildPaymentRequest2({
        cart,
        AddressData,
        BillingData,
        subTotal,
        total,
    });

    // Ödeme yöntemi değiştiğinde
    const handlePaymentMethodChange = (method) => {
        // Only update formKey if the method actually changed
        if (paymentMethod !== method) {
            setPaymentMethod(method);
            setPaymentState(prev => ({
                ...prev,
                method: method,
                formKey: Date.now(), // Form'u yeniden yüklemek için yeni key
                isProcessing: false
            }));
        }
    };

    // Ödeme işlemi başladığında
    const handlePaymentStart = (paymentData) => {
        setPaymentState(prev => ({
            ...prev,
            ...paymentData,
            isProcessing: true
        }));
    };

    // Ödeme işlemi bittiğinde
    const handlePaymentComplete = (result) => {
        setPaymentState(prev => ({
            ...prev,
            isProcessing: false
        }));
        setPaymentResult(result);
        
        // Ödeme tamamlandığında Confirmation tab'ına yönlendir
        if (result && (result.status === 'success' || result.paymentStatus === 'SUCCESS')) {
            toggleTab(4);
        }
    };

    // Location state'inden gelen ödeme sonucunu kontrol et
    useEffect(() => {
        console.log('Location state:', location.state);
        if (location.state?.paymentResult) {
            console.log('Setting payment result:', location.state.paymentResult);
            setPaymentResult(location.state.paymentResult);
            if (location.state.activeTab) {
                setActiveTab(location.state.activeTab);
                setPassedSteps(prev => [...prev, location.state.activeTab]);
            }
        }
    }, [location.state]);

    // Sayfa başlığını ayarla
    useEffect(() => {
        document.title = "Ödeme | iyzico";
    }, []);

    // Auto start tour
    useEffect(() => {
        autoStartTour();
    }, [autoStartTour]);

    return (
        <React.Fragment>
            <div className="page-content" id="checkout-page-container">
                <Container fluid id="checkout-container">
                    <BreadCrumb title="Ödeme" pageTitle="Mağaza" id="checkout-breadcrumb"/>

                    <Row id="checkout-main-row">
                        <Col xl={8} id="checkout-form-col">
                            <Card id="checkout-form-card">
                                <CardBody className="checkout-tab" id="checkout-tab-body">
                                    <Form action="#" id="checkout-form">
                                        {/* Tab Navigation */}
                                        <div className="step-arrow-nav mt-n3 mx-n3 mb-3" id="checkout-tab-navigation">
                                            <Nav
                                                className="nav-pills nav-justified custom-nav"
                                                role="tablist"
                                                id="checkout-tab-nav"
                                            >
                                                <NavItem role="presentation" id="checkout-tab-billing">
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({active: activeTab === 1, done: activeTab <= 4 && activeTab >= 0,}, "p-3 fs-15")}
                                                        onClick={() => toggleTab(1)}
                                                        id="checkout-tab-billing-link">
                                                        <i className="ri-user-2-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                                        Fatura Bilgileri
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem role="presentation" id="checkout-tab-shipping">
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({active: activeTab === 2, done: activeTab <= 4 && activeTab > 1,}, "p-3 fs-15")}
                                                        onClick={() => toggleTab(2)}
                                                        id="checkout-tab-shipping-link">
                                                        <i className="ri-truck-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                                        Teslimat Bilgileri
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem role="presentation" id="checkout-tab-payment">
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeTab === 3,
                                                            done: activeTab <= 4 && activeTab > 2,
                                                            'text-muted': !cart || cart.length === 0
                                                        }, "p-3 fs-15")}
                                                        onClick={() => toggleTab(3)}
                                                        id="checkout-tab-payment-link">
                                                        <i className={`ri-bank-card-line fs-16 p-2 ${!cart || cart.length === 0 ? 'bg-light text-muted' : 'bg-primary-subtle text-primary'} rounded-circle align-middle me-2`}></i>
                                                        Ödeme
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem role="presentation" id="checkout-tab-confirmation">
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({active: activeTab === 4, done: activeTab <= 4 && activeTab > 3,}, "p-3 fs-15")}
                                                        id="checkout-tab-confirmation-link">
                                                        <i className="ri-checkbox-circle-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                                        Sonuç
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        {/* Tab İçerikleri */}
                                        <TabContent activeTab={activeTab} id="checkout-tab-content">
                                            {/* Tab #1: Fatura Bilgileri */}
                                            <TabPane tabId={1} id="pills-bill-info">
                                                <BillingInfo
                                                    toggleTab={toggleTab}
                                                    activeTab={activeTab}
                                                />
                                            </TabPane>

                                            {/* Tab #2: Teslimat Bilgileri */}
                                            <TabPane tabId={2} id="pills-shipping-info">
                                                <ShippingInfo
                                                    toggleTab={toggleTab}
                                                    activeTab={activeTab}
                                                    shippingMethod={shippingMethod}
                                                    setShippingMethod={setShippingMethod}
                                                />
                                            </TabPane>

                                            {/* Tab #3: Ödeme Seçenekleri */}
                                            <TabPane tabId={3} id="pills-payment-options">
                                                <PaymentOptions
                                                    toggleTab={toggleTab}
                                                    activeTab={activeTab}
                                                    paymentMethod={paymentMethod}
                                                    setPaymentMethod={handlePaymentMethodChange}
                                                    toggleModal={toggleModal}
                                                    paymentRequest={paymentRequest}
                                                    paymentRequest2={paymentRequest2}
                                                    paymentState={paymentState}
                                                    onPaymentStart={handlePaymentStart}
                                                    onPaymentComplete={handlePaymentComplete}
                                                />
                                            </TabPane>

                                            {/* Tab #4: Onay Ekranı */}
                                            <TabPane tabId={4} id="pills-finish">
                                                <Confirmation paymentResult={paymentResult}/>
                                            </TabPane>
                                        </TabContent>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Sağ Panel: Sepet Özeti */}
                        <Col xl={4} id="checkout-summary-col">
                            <SummaryPanel
                                cart={cart}
                                calculateSubTotal={() => subTotal}
                                shippingCharge={shippingCharge}
                                taxRate={taxRate}
                                calculateTotal={() => total}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Ödeme İsteği Modal */}
            <RequestViewModal
                isOpen={modalOpen}
                toggle={toggleModal}
                request={paymentRequest}
                request2={paymentRequest2}
                paymentMethod={paymentMethod}
            />
        </React.Fragment>
    );
};

export default Checkout;