import React, {useEffect, useState} from "react"
import {CardBody, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap"
import classnames from "classnames"
import PrismCode from "../../../Components/Common/Prism"

const CreateProductModal = ({isOpen, toggle}) => {

    /**
     * Bu kısımda endpoint url tanımlanıyor.
     */
    const endpointUrl = 'https://api.iyzipay.com/v2/subscription/products'

    /**
     * Bu kısımda form verileri tanımlanıyor.
     * Yani iyzico'ya gönderilecek JSON verisi
     */
    const [formData, setFormData] = useState({
        conversationId: "conversationId",
        locale: "tr",
        name: "",
        description: ""
    })


    /**
     * Bu kısımda iyzico'dan dönen response verisi tanımlanıyor.
     * Dinamik olarak çalışması için data içerisindeki name ve description formData içerisindeki name ve description değerlerini takip eder.
     */
    const [response, setResponse] = useState({
        "status": "success",
        "systemTime": 1686785492734,
        "data": {
            "referenceCode": "ac3afdd2-69af-4ca6-a284-46bf8540a954",
            "createdDate": 1686785492730,
            "name": "",
            "description": "",
            "status": "ACTIVE",
            "pricingPlans": []
        }
    })

    /**
     * Bu kısımda headers tanımlanıyor.
     */
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY_HERE',
        'x-iyzi-rnd': '123456789',
    }


    /**
     * Bu fonksiyon ile input alanlarındaki değişiklikler
     * formData içerisine kaydediliyor.
     */
    const handleInputChange = (e) => {
        const {id, value} = e.target
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }))
    }

    /**
     * Bu kısımda formData içerisindeki
     * name ve description değerleri değiştiğinde
     * response içerisindeki
     * name ve description değerlerini güncelliyoruz.
     *
     * Bu sayede response içerisindeki name ve description değerleri
     * her zaman formData içerisindeki name ve description değerlerini takip eder.
     */
    useEffect(() => {
        setResponse(prevResponse => ({
            ...prevResponse,
            data: {
                ...prevResponse.data,
                name: formData.name,
                description: formData.description
            }
        }))
    }, [formData.name, formData.description])


    /**
     * Bu fonksiyon ile tabler arasında geçiş yapılıyor.
     * Bu kısım değiştirilmeyecek
     */
    const [activeTab, setActiveTab] = useState('1')
    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }


    return (
        <Modal isOpen={isOpen} toggle={toggle} role="dialog" autoFocus={true} centered id="requestViewModal" size="xl">
            <ModalHeader toggle={toggle}>
                <h5 className="modal-title" id="requestViewModalLabel">Ürün Oluşturma</h5>
            </ModalHeader>
            <ModalBody style={{maxHeight: '80vh', overflowY: 'auto'}}>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({active: activeTab === '1'})} onClick={() => toggleTab('1')}>Form ve JSON</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({active: activeTab === '2'})} onClick={() => toggleTab('2')}>Headers</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({active: activeTab === '3'})} onClick={() => toggleTab('3')}>Endpoint</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({active: activeTab === '4'})} onClick={() => toggleTab('4')}>Response</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-3">
                    <TabPane tabId="1">
                        <CardBody>
                            <div className="row">
                                <div className="col-md-6">
                                    {
                                        /**
                                         * Bu kısımda form elemanları tanımlanıyor.
                                         * Form elemanları değiştirilebilir.
                                         */
                                    }
                                    <h5>Ürün Ekleme Formu</h5>
                                    <hr/>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Ürün adı</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Ürün açıklama</label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-6">
                                    <h5>JSON</h5>
                                    <hr/>
                                    <PrismCode code={JSON.stringify(formData, null, 2)} language="json"/>
                                </div>
                            </div>
                        </CardBody>
                    </TabPane>
                    <TabPane tabId="2">
                        <CardBody>
                            <PrismCode code={JSON.stringify(headers, null, 2)} language="json"/>
                        </CardBody>
                    </TabPane>
                    <TabPane tabId="3">
                        <CardBody>
                            <PrismCode code={endpointUrl} language="plaintext"/>
                        </CardBody>
                    </TabPane>
                    <TabPane tabId="4">
                        <CardBody>
                            <PrismCode code={JSON.stringify(response, null, 2)} language="json"/>
                        </CardBody>
                    </TabPane>
                </TabContent>
            </ModalBody>
        </Modal>
    )
}

export default CreateProductModal