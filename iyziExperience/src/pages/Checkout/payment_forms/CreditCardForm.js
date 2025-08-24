import {Col, Input, Label, FormGroup, Button} from "reactstrap";
import React, { useState } from "react";
import DummyData from "../data/dummy_data"

const CreditCardForm = ({paymentRequest, onPaymentStart, onPaymentComplete}) => {
    const {CreditCardData} = DummyData;
    const [use3DS, setUse3DS] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    
    const handlePayment = async () => {
        if (!paymentRequest) {
            setError("Ödeme bilgileri bulunamadı.");
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);
            
            // Ödeme başladığını bildir
            onPaymentStart?.();

            // Doğrudan auth işlemi
            const authResponse = await fetch("http://localhost:8000/api/payment/initialize", {
                method: "POST",
                headers: {
                    "Payment-Method": "CreditCard",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(paymentRequest),
            });

            const authData = await authResponse.json();

            console.log('Auth response:', authData);

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
            console.error("Credit card payment error:", err);
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
    
    return (
        <>
            <Col md={12}>
                <Label htmlFor="cc-name" className="form-label">Kart Sahibi</Label>
                <Input type="text" className="form-control" id="cc-name" defaultValue={CreditCardData.fullName} disabled={true}/>
                <small className="text-muted">Kartta görüntülenen tam ad</small>
            </Col>
            <Col md={6}>
                <Label htmlFor="cc-number" className="form-label">Kart Numarası</Label>
                <Input type="text" className="form-control" id="cc-number" defaultValue={CreditCardData.cardNumber}/>
            </Col>
            <Col md={3}>
                <Label htmlFor="cc-expiration" className="form-label">Geçerlilik Süresi</Label>
                <Input type="text" className="form-control" id="cc-expiration" defaultValue={CreditCardData.expiration}/>
            </Col>
            <Col md={3}>
                <Label htmlFor="cc-cvv" className="form-label">Güvenlik Kodu</Label>
                <Input type="text" className="form-control" id="cc-cvv" defaultValue={CreditCardData.cvv}/>
            </Col>
            <Col md={12}>
                <FormGroup check className="mt-3">
                    <Input 
                        type="checkbox" 
                        id="use-3ds" 
                        checked={use3DS}
                        onChange={(e) => setUse3DS(e.target.checked)}
                    />
                    <Label check htmlFor="use-3ds">
                        3D Secure güvenlik doğrulaması kullan
                    </Label>
                    <small className="text-muted d-block">
                        {use3DS ? 
                            "Ödeme işlemi sırasında ek güvenlik doğrulaması yapılacak" : 
                            "Hızlı ödeme (3D Secure olmadan)"
                        }
                    </small>
                </FormGroup>
            </Col>
            
            {error && (
                <Col md={12}>
                    <div className="alert alert-danger mt-3">
                        <strong>Hata:</strong> {error}
                    </div>
                </Col>
            )}
            
            <Col md={12} className="mt-3">
                <Button 
                    color="primary" 
                    className="w-100"
                    onClick={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Ödeme İşleniyor...
                        </>
                    ) : (
                        'Ödemeyi Tamamla'
                    )}
                </Button>
            </Col>
        </>
    )
}

export default CreditCardForm