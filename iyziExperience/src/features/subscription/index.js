import Plans from "../Store/Plans";
import React, {useState} from "react"
import {ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown} from "reactstrap";
import ProductSettingsModalList from "./ProductSettingsModalList";

const Subscription = () => {

    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalName) => {
        setActiveModal(modalName);
    };

    return (
        <>
            <div className="bg-white w-100 mt-3 p-3">
                <Row className="g-3">
                    <Col xs={12} sm={6} md={3}>
                        <ButtonGroup className="w-100">
                            <UncontrolledDropdown className="w-100">
                                <DropdownToggle tag="button" className="btn btn-info w-100">
                                    Ürün Ayarları <i className="mdi mdi-chevron-down"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => openModal('createProduct')}>Ürün Oluşturma</DropdownItem>
                                    <DropdownItem>Ürün Güncelleme</DropdownItem>
                                    <DropdownItem>Ürün Silme</DropdownItem>
                                    <DropdownItem>Ürün Detay</DropdownItem>
                                    <DropdownItem>Ürün Listeleme</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </ButtonGroup>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                        <ButtonGroup className="w-100">
                            <UncontrolledDropdown className="w-100">
                                <DropdownToggle tag="button" className="btn btn-secondary w-100">
                                    Ödeme Planı Ayarları <i className="mdi mdi-chevron-down"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Ödeme Planı Oluşturma</DropdownItem>
                                    <DropdownItem>Ödeme Planı Güncelleme</DropdownItem>
                                    <DropdownItem>Ödeme Planı Silme</DropdownItem>
                                    <DropdownItem>Ödeme Planı Detay</DropdownItem>
                                    <DropdownItem>Ödeme Planı Listeleme</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </ButtonGroup>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                        <ButtonGroup className="w-100">
                            <UncontrolledDropdown className="w-100">
                                <DropdownToggle tag="button" className="btn btn-primary w-100">
                                    Abonelik İşlemleri <i className="mdi mdi-chevron-down"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Abonelik Aktifleştirme</DropdownItem>
                                    <DropdownItem>Abonelik Ödeme Tekrarlama</DropdownItem>
                                    <DropdownItem>Abonelik Yükseltme</DropdownItem>
                                    <DropdownItem>Abonelik İptali</DropdownItem>
                                    <DropdownItem>Abonelik Detayı</DropdownItem>
                                    <DropdownItem>Abonelik Arama</DropdownItem>
                                    <DropdownItem>Abonelik Kart Güncelleme</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </ButtonGroup>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                        <ButtonGroup className="w-100">
                            <UncontrolledDropdown className="w-100">
                                <DropdownToggle tag="button" className="btn btn-dark w-100">
                                    Abone İşlemleri <i className="mdi mdi-chevron-down"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Abone Güncelleme</DropdownItem>
                                    <DropdownItem>Abone Detayı</DropdownItem>
                                    <DropdownItem>Abone Listeleme</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
            <Plans/>
            <ProductSettingsModalList activeModal={activeModal} setActiveModal={setActiveModal}/>
        </>
    )
}

export default Subscription