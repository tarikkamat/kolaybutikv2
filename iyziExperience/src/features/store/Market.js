import {Card, CardBody, Col, Row} from "reactstrap";
import Rating from "react-rating";
import React from "react";
import {addToCart} from "../../slices/thunks";
import ToastAlert from "../../Components/Common/ToastAlert";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const Market = ({products}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleAddToCart = (product) => {
        dispatch(addToCart({product, quantity: 1}))
        ToastAlert("Ürün sepete eklendi.", "success")
    }

    const handleBuyNow = (product) => {
        dispatch(addToCart({product, quantity: 1}))
        ToastAlert("Ürün sepete eklendi.", "success")
        navigate('/checkout')
    }

    return (
        <Row className="mt-2">
            {products ? (
                products.map((product) => (
                    <Col xl={3} lg={6} key={product.id}>
                        <Card className="ribbon-box right overflow-hidden">
                            <CardBody className="text-center p-4">
                                {Math.random() < 0.5 && (
                                    <div className="ribbon ribbon-info ribbon-shape trending-ribbon">
                                        <i className="ri-flashlight-fill text-white align-bottom"></i>
                                        <span className="trending-ribbon-text ms-1">Çok Satan</span>
                                    </div>
                                )}
                                <img src={product.image} alt={product.title} height="100" id="product-image"/>
                                <h5 className="mb-1 mt-4 link-primary" id="product-title">{product.title}</h5>
                                <p className="text-muted mb-4" id="product-category">{product.category}</p>
                                <Rating stop={5} emptySymbol="mdi mdi-star-outline text-muted fa-1x" fullSymbol="mdi mdi-star text-warning" initialRating={product.rating.rate} readonly/>
                                <Row className="mt-4">
                                    <h5 id="product-price">{product.price}₺</h5>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={6} sm={6} xs={6} id="addCart">
                                        <div className="mt-4 btn btn-light w-100" onClick={() => handleAddToCart(product)}>Sepete Ekle</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={6} sm={6} xs={6} id="buyNow">
                                        <div className="mt-4 btn btn-primary w-100" onClick={() => handleBuyNow(product)}>Hızlı Satın Al</div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                ))
            ) : (
                <p>Lütfen bekleyin...</p>
            )}
        </Row>
    )
}

export default Market