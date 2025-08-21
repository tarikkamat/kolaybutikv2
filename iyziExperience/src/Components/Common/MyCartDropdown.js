import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {Col, Dropdown, DropdownMenu, DropdownToggle, Row} from 'reactstrap'
import SimpleBar from "simplebar-react"
import {removeFromCart} from '../../slices/thunks'

const MyCartDropdown = () => {
    const dispatch = useDispatch()
    const {cart, cartItemCount} = useSelector((state) => state.Cart)

    const [isCartDropdown, setIsCartDropdown] = useState(false)

    const toggleCartDropdown = () => {
        setIsCartDropdown(!isCartDropdown)
    }

    const removeItem = (product) => {
        dispatch(removeFromCart({product, quantity: 1}))
    }

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    }

    return (
        <React.Fragment>
            <Dropdown id="mycartdropdown" isOpen={isCartDropdown} toggle={toggleCartDropdown}
                      className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle type="button" tag="button"
                                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <i className='bx bx-shopping-bag fs-22'></i>
                    <span
                        className="position-absolute cartitem-badge topbar-badge fs-10 translate-middle badge rounded-pill bg-info">
                        {cartItemCount}
                        <span className="visually-hidden">unread messages</span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart"
                              aria-labelledby="page-header-cart-dropdown">
                    <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 fs-16 fw-semibold ms-1">Sepetim</h6>
                            </Col>
                            <div className="col-auto">
                                <span className="badge bg-warning-subtle text-warning fs-13">
                                    <span className="cartitem-badge"> {cartItemCount} </span> adet ürün
                                </span>
                            </div>
                        </Row>
                    </div>
                    <SimpleBar style={{maxHeight: "300px"}}>
                        <div className="p-2">
                            {cart.length === 0 ? (
                                <div className="text-center empty-cart" id="empty-cart">
                                    <div className="avatar-md mx-auto my-3">
                                        <div className="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                                            <i className='bx bx-cart'></i>
                                        </div>
                                    </div>
                                    <h5 className="mb-3">😱 Henüz hiç ürün eklememişsin!</h5>
                                    <Link to="/store" className="btn btn-success w-md mb-3">
                                        Mağazaya Git
                                    </Link>
                                </div>
                            ) : (
                                cart.map((item, key) => (
                                    <div className="d-block dropdown-item text-wrap dropdown-item-cart px-3 py-2"
                                         key={key}>
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} className="me-3 rounded-circle avatar-sm p-2 bg-light"
                                                 alt={item.title}/>
                                            <div className="flex-grow-1">
                                                <h6 className="mt-0 mb-1 fs-14">
                                                    <Link to="/apps-ecommerce-product-details"
                                                          className="text-reset">{item.title}</Link>
                                                </h6>
                                                <p className="mb-0 fs-12 text-muted">
                                                    Adet: <span>{item.quantity} x {item.price}₺</span>
                                                </p>
                                            </div>
                                            <div className="px-2">
                                                <h5 className="m-0 fw-normal">{(item.quantity * item.price).toFixed(2)}₺</h5>
                                            </div>
                                            <div className="ps-2">
                                                <button type="button"
                                                        className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
                                                        onClick={() => removeItem(item)}>
                                                    <i className="ri-close-fill fs-16"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </SimpleBar>
                    {cart.length > 0 && (
                        <div className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border"
                             id="checkout-elem">
                            <div className="d-flex justify-content-between align-items-center pb-3">
                                <h5 className="m-0 text-muted">Toplam:</h5>
                                <div className="px-2">
                                    <h5 className="m-0">{calculateTotal()}₺</h5>
                                </div>
                            </div>
                            <Link to="/checkout" className="btn btn-success text-center w-100">
                                Ödeme
                            </Link>
                        </div>
                    )}
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    )
}

export default MyCartDropdown