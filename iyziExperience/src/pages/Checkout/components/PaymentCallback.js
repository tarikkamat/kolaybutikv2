import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const method = searchParams.get('method');

                console.log('Callback params:', { token, method });

                if (!token) {
                    throw new Error('Token bulunamadı');
                }

                // Backend'den ödeme sonucunu al
                const response = await fetch('http://localhost:8000/api/payment/retrieve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Payment-Method': method || 'CheckoutForm'
                    },
                    body: JSON.stringify({
                        token,
                        locale: 'tr',
                        conversationId: token // Token'ı conversationId olarak kullan
                    })
                });

                const result = await response.json();
                console.log('Backend response:', result);

                if (result.errors) {
                    throw new Error(Object.values(result.errors).flat().join(', '));
                }

                // Backend'den gelen yanıtın yapısını kontrol et ve düzenle
                const paymentResult = {
                    status: result.original?.status || result.status,
                    paymentId: result.original?.paymentId || result.paymentId,
                    paymentStatus: result.original?.paymentStatus || result.paymentStatus,
                    conversationId: result.original?.conversationId || result.conversationId
                };

                console.log('Processed payment result:', paymentResult);

                // Ödeme sonucunu localStorage'a kaydet
                localStorage.setItem('paymentResult', JSON.stringify(paymentResult));

                // Checkout sayfasına yönlendir
                navigate('/checkout', { 
                    state: { 
                        paymentResult: paymentResult,
                        activeTab: 4 // Confirmation tab'ı
                    }
                });
            } catch (error) {
                console.error('Callback işleme hatası:', error);
                navigate('/checkout', { 
                    state: { 
                        paymentResult: {
                            status: 'error',
                            paymentStatus: 'FAILURE',
                            errorMessage: error.message || 'Ödeme sonucu alınamadı'
                        },
                        activeTab: 4
                    }
                });
            }
        };

        // URL'de token varsa işlemi başlat
        if (searchParams.get('token')) {
            handleCallback();
        } else {
            // Token yoksa direkt Checkout sayfasına yönlendir
            navigate('/checkout');
        }
    }, [searchParams, navigate]);

    return (
        <Card>
            <CardBody className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
                <p className="mt-3">Ödeme sonucu kontrol ediliyor...</p>
            </CardBody>
        </Card>
    );
};

export default PaymentCallback; 