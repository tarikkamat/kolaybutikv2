import React, {useState} from "react";
import {Card, CardBody, Col, Form, Input, Label, Row, Button, Alert} from "reactstrap";
import VisaSVG from "../card_svg/VisaSVG";
import MasterSVG from "../card_svg/MasterSVG";
import TroySVG from "../card_svg/TroySVG";
import AmexSVG from "../card_svg/AmexSVG";

const SavedCardForm = ({paymentRequest, onPaymentStart, onPaymentComplete}) => {
    const creditCardData = [
        {id: 1, name: "Visa", number: "4111 XXXX XXXX 1234", type: "visa", cardToken: "card_token_1"},
        {id: 2, name: "Mastercard", number: "5555 XXXX XXXX 5678", type: "mastercard", cardToken: "card_token_2"},
        {id: 3, name: "Troy", number: "3782 XXXXXX X1000", type: "troy", cardToken: "card_token_3"},
        {id: 4, name: "American Express", number: "6011 XXXX XXXX 2222", type: "amex", cardToken: "card_token_4"},
    ];

    const [selectedCard, setSelectedCard] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleCardSelection = (cardId) => {
        setSelectedCard(cardId);
        setError(null); // Hata mesajını temizle
    };

    const handlePayment = async () => {
        if (!paymentRequest) {
            setError("Ödeme bilgileri bulunamadı.");
            return;
        }

        if (!selectedCard) {
            setError("Lütfen bir kart seçin.");
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);
            
            // Ödeme başladığını bildir
            onPaymentStart?.();

            // Seçili kartın bilgilerini payment request'e ekle
            const selectedCardData = creditCardData.find(card => card.id === selectedCard);
            const paymentRequestWithCard = {
                ...paymentRequest,
                cardToken: selectedCardData.cardToken
            };

            // Doğrudan auth işlemi
            const authResponse = await fetch("http://localhost:8000/api/payment/initialize", {
                method: "POST",
                headers: {
                    "Payment-Method": "SavedCard",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(paymentRequestWithCard),
            });

            const authData = await authResponse.json();

            console.log('SavedCard Auth response:', authData);

            if (!authResponse.ok) {
                throw new Error(authData.error || `HTTP error! status: ${authResponse.status}`);
            }

            if (authData.status === "failure" || authData.status === "error") {
                throw new Error(authData.error || authData.errorMessage || "Ödeme işlemi başarısız oldu.");
            }

            // Başarılı ödeme sonucu
            onPaymentComplete?.({
                status: authData.status,
                paymentStatus: authData.paymentStatus,
                paymentId: authData.paymentId,
                conversationId: authData.conversationId,
                data: authData
            });

        } catch (err) {
            console.error("SavedCard payment error:", err);
            setError(err.message || "Ödeme işlemi sırasında bir hata oluştu.");
            onPaymentComplete?.({
                status: 'error',
                paymentStatus: 'FAILURE',
                errorMessage: err.message || "Ödeme işlemi başarısız oldu."
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const CardIcon = ({type}) => {
        const icons = {
            visa: (
                <VisaSVG/>
            ),
            mastercard: (
                <MasterSVG/>
            ),
            troy: (
                <TroySVG/>
            ),
            amex: (
                <AmexSVG/>
            )
        };
        return icons[type] || null;
    };

    return (
        <>
            <Form>
                <Row>
                    {creditCardData.map((card) => (
                        <Col key={card.id} md={6} lg={4} className="mb-3">
                            <Card 
                                onClick={() => handleCardSelection(card.id)}
                                className={`cursor-pointer ${selectedCard === card.id ? 'border-primary' : ''}`}
                            >
                                <CardBody>
                                    <div className="d-flex align-items-center">
                                        <Input
                                            type="radio"
                                            id={`card-${card.id}`}
                                            name="selectedCard"
                                            checked={selectedCard === card.id}
                                            onChange={() => handleCardSelection(card.id)}
                                            className="me-2"
                                        />
                                        <Label for={`card-${card.id}`} className="mb-0 d-flex align-items-center">
                                            <div className="me-2">
                                                <CardIcon type={card.type}/>
                                            </div>
                                            <div>
                                                <div>
                                                    <strong>{card.name}</strong>
                                                </div>
                                                <div className="text-muted">{card.number}</div>
                                            </div>
                                        </Label>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Form>

            {error && (
                <Alert color="danger" className="mt-3">
                    <strong>Hata:</strong> {error}
                </Alert>
            )}

            <div className="mt-4">
                <Button 
                    color="primary" 
                    className="w-100"
                    onClick={handlePayment}
                    disabled={isProcessing || !selectedCard}
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Ödeme İşleniyor...
                        </>
                    ) : (
                        'Saklı Kartla Ödemeyi Tamamla'
                    )}
                </Button>
                
                {!selectedCard && (
                    <small className="text-muted d-block mt-2">
                        Ödeme yapmak için yukarıdan bir kart seçin.
                    </small>
                )}
            </div>
        </>
    );
};

export default SavedCardForm;