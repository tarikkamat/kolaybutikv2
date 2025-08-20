import React, {useState} from "react"
import {CardBody, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap"
import classnames from "classnames"
import PrismCode from "../../../Components/Common/Prism"

const RequestViewModal = ({isOpen, toggle, request, request2, paymentMethod}) => {
    const [activeTab, setActiveTab] = useState('1')

    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    // Ödeme yöntemine göre hangi isteği göstereceğini belirle
    const getCurrentRequest = () => {
        switch (paymentMethod) {
            case 1: // Kredi Kartı
                if (activeTab === '1') return request; // QuickPwiForm
                if (activeTab === '2') return request2; // CreditCardForm
                return request;
            case 2: // CheckoutForm
                return request;
            case 3: // Pay with iyzico
                return request;
            case 4: // Saklı Kartlarım
                return request2;
            default:
                return request;
        }
    }

    const getPaymentMethodName = () => {
        switch (paymentMethod) {
            case 1:
                return "Kredi Kartı";
            case 2:
                return "CheckoutForm";
            case 3:
                return "Pay with iyzico";
            case 4:
                return "Saklı Kartlarım";
            default:
                return "Ödeme";
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY_HERE',
        'x-iyzi-rnd': '123456789',
    }

    // Ödeme yöntemine göre endpoint URL'ini belirle
    const getEndpointUrl = () => {
        const baseUrl = 'https://api.iyzipay.com';
        
        switch (paymentMethod) {
            case 1: // Kredi Kartı
                if (activeTab === '1') {
                    // QuickPwi Form
                    return `${baseUrl}/payment/iyzipos/checkoutform/initialize/auth/ecom`;
                } else {
                    // CreditCard Form - 3DS veya non-3DS olabilir
                    return `${baseUrl}/payment/3dsecure/initialize`;
                }
            case 2: // CheckoutForm
                return `${baseUrl}/payment/iyzipos/checkoutform/initialize/auth/ecom`;
            case 3: // Pay with iyzico
                return `${baseUrl}/payment/pay-with-iyzico/initialize`;
            case 4: // Saklı Kartlarım
                return `${baseUrl}/payment/auth`;
            default:
                return `${baseUrl}/payment/iyzipos/initialize3ds/ecom`;
        }
    }

    const endpointUrl = getEndpointUrl();

    const currentRequest = getCurrentRequest();

    return (
        <Modal isOpen={isOpen} toggle={toggle} role="dialog" autoFocus={true} centered id="requestViewModal" size="xl">
            <ModalHeader toggle={toggle}>
                <h5 className="modal-title" id="requestViewModalLabel">
                    Ödeme İsteği Detayları - {getPaymentMethodName()}
                </h5>
            </ModalHeader>
            <ModalBody style={{maxHeight: '80vh', overflowY: 'auto'}}>
                <Nav tabs>
                    {paymentMethod === 1 && (
                        <>
                            <NavItem>
                                <NavLink className={classnames({active: activeTab === '1'})} onClick={() => toggleTab('1')}>QuickPwi Form</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({active: activeTab === '2'})} onClick={() => toggleTab('2')}>CreditCard Form</NavLink>
                            </NavItem>
                        </>
                    )}
                    {paymentMethod !== 1 && (
                        <NavItem>
                            <NavLink className={classnames({active: activeTab === '1'})} onClick={() => toggleTab('1')}>JSON</NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        <NavLink className={classnames({active: activeTab === '3'})} onClick={() => toggleTab('3')}>Headers</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({active: activeTab === '4'})} onClick={() => toggleTab('4')}>Endpoint</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-3">
                    <TabPane tabId="1">
                        <CardBody>
                            <PrismCode code={JSON.stringify(currentRequest, null, 2)} language="json"/>
                        </CardBody>
                    </TabPane>
                    {paymentMethod === 1 && (
                        <TabPane tabId="2">
                            <CardBody>
                                <PrismCode code={JSON.stringify(request2, null, 2)} language="json"/>
                            </CardBody>
                        </TabPane>
                    )}
                    <TabPane tabId="3">
                        <CardBody>
                            <PrismCode code={JSON.stringify(headers, null, 2)} language="json"/>
                        </CardBody>
                    </TabPane>
                    <TabPane tabId="4">
                        <CardBody>
                            <PrismCode code={endpointUrl} language="plaintext"/>
                        </CardBody>
                    </TabPane>
                </TabContent>
            </ModalBody>
        </Modal>
    )
}

export default RequestViewModal