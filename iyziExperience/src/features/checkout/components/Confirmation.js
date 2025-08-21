// src/pages/Index/components/Confirmation.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = ({ paymentResult }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Sadece başarılı ödeme durumunda yönlendir
        if (paymentResult?.paymentStatus === "SUCCESS") {
            const timer = setTimeout(() => {
                navigate('/store');
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [navigate, paymentResult]);

    const getStatusIcon = () => {
        if (!paymentResult) return "lupuorrc";
        return paymentResult.paymentStatus === "SUCCESS" ? "lupuorrc" : "mordor";
    };

    const getStatusColor = () => {
        if (!paymentResult) return "primary:#0ab39c,secondary:#405189";
        return paymentResult.paymentStatus === "SUCCESS" 
            ? "primary:#0ab39c,secondary:#405189" 
            : "primary:#f06548,secondary:#405189";
    };

    const getStatusMessage = () => {
        if (!paymentResult) return "Thank you! Your Order is Completed!";
        return paymentResult.paymentStatus === "SUCCESS" 
            ? "Thank you! Your Order is Completed!" 
            : "Payment Failed!";
    };

    return (
        <div className="text-center py-5" id="confirmation-container">
            <div className="mb-4" id="confirmation-icon-container">
                <lord-icon
                    src={`https://cdn.lordicon.com/${getStatusIcon()}.json`}
                    trigger="loop"
                    colors={getStatusColor()}
                    style={{width: "120px", height: "120px"}}
                    id="confirmation-status-icon"
                ></lord-icon>
            </div>
            <h5 id="confirmation-status-message">{getStatusMessage()}</h5>
            <p className="text-muted" id="confirmation-status-description">
                {paymentResult?.paymentStatus === "SUCCESS" 
                    ? "You will receive an order confirmation email with details of your order."
                    : "Please try again or contact customer support."}
            </p>

            {paymentResult && (
                <div className="mt-4" id="confirmation-details">
                    <h3 className="fw-semibold" id="confirmation-payment-id">
                        Payment ID:{" "}
                        <span className="text-primary" id="confirmation-payment-id-value">
                            {paymentResult.paymentId || paymentResult.data?.paymentId || paymentResult.data?.id || 'N/A'}
                        </span>
                    </h3>
                    {(paymentResult.conversationId || paymentResult.data?.conversationId) && (
                        <p className="text-muted mt-2" id="confirmation-conversation-id">
                            Conversation ID: {paymentResult.conversationId || paymentResult.data?.conversationId}
                        </p>
                    )}
                    {paymentResult.errorMessage && (
                        <p className="text-danger mt-2" id="confirmation-error-message">
                            {paymentResult.errorMessage}
                        </p>
                    )}
                </div>
            )}
            {paymentResult?.paymentStatus === "SUCCESS" && (
                <p className="text-muted mt-4" id="confirmation-redirect-message">
                    10 saniye içinde mağaza sayfasına yönlendirileceksiniz...
                </p>
            )}
        </div>
    );
};

export default Confirmation;