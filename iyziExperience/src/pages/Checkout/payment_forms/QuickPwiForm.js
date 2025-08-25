import React, {useEffect, useState, useRef, useCallback} from "react";

const QuickPwiForm = ({paymentRequest, paymentState = {}, onPaymentStart, onPaymentComplete}) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const formContainer = useRef(null);
    const isInitializing = useRef(false);
    const currentToken = useRef(null);
    const lastFormKey = useRef(null);

    const cleanup = useCallback(() => {
        const existingScripts = document.querySelectorAll('script[src*="iyzipay"], script[data-iyzipay], script[src*="iyzico"]');
        existingScripts.forEach(script => {
            script.remove();
        });

        try {
            if (window.iyziInit) {
                window.iyziInit = undefined;
            }
            if (window.iyziUcsInit) {
                window.iyziUcsInit = undefined;
            }
            if (window.iyzipay) {
                window.iyzipay = undefined;
            }
        } catch (err) {
            console.warn('Error clearing iyzico globals:', err);
        }

        if (formContainer.current) {
            formContainer.current.innerHTML = '';
        }

        currentToken.current = null;
        setIsInitialized(false);
    }, []);

    const loadScript = useCallback((src) => {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                if (existingScript.getAttribute('data-loaded') === 'true') {
                    resolve();
                    return;
                }
                existingScript.onload = resolve;
                existingScript.onerror = reject;
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.setAttribute('data-iyzipay', 'true');
            script.onload = () => {
                script.setAttribute('data-loaded', 'true');
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }, []);

    const executeInlineScript = useCallback((scriptContent) => {
        return new Promise((resolve) => {
            try {
                const script = document.createElement('script');
                script.setAttribute('data-iyzipay', 'true');
                script.textContent = scriptContent;
                document.head.appendChild(script);

                setTimeout(resolve, 50);
            } catch (err) {
                console.warn('Inline script execution error:', err);
                resolve();
            }
        });
    }, []);

    const processFormContent = useCallback(async (htmlContent) => {
        // Check if the form container still exists and is visible
        if (!formContainer.current || !document.contains(formContainer.current)) {
            console.log('Form container not found or not in DOM, skipping form processing');
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        const scripts = Array.from(tempDiv.getElementsByTagName('script'));
        const externalScripts = scripts.filter(script => script.src);
        const inlineScripts = scripts.filter(script => !script.src && script.textContent.trim());

        scripts.forEach(script => script.remove());

        if (formContainer.current) {
            const content = tempDiv.innerHTML;
            if (content.trim()) {
                formContainer.current.innerHTML += content;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        for (const script of externalScripts) {
            try {
                await loadScript(script.src);
                console.log('External script loaded:', script.src);
            } catch (err) {
                console.error('Failed to load external script:', script.src, err);
            }
        }

        for (const script of inlineScripts) {
            try {
                await executeInlineScript(script.textContent);
                console.log('Inline script executed');
            } catch (err) {
                console.error('Failed to execute inline script:', err);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            if (typeof window.iyziInit === 'function') {
                console.log('Calling iyziInit...');
                window.iyziInit();
            }

            if (typeof window.iyziUcsInit === 'function') {
                console.log('Calling iyziUcsInit...');
                window.iyziUcsInit();
            }
        } catch (err) {
            console.error('Init function error:', err);
        }
    }, [loadScript, executeInlineScript]);

    const initializeCheckoutForm = useCallback(async () => {
        // Prevent multiple simultaneous initializations
        if (isInitializing.current) {
            console.log('Already initializing, skipping...');
            return;
        }

        // Check if form is visible and container exists
        if (!formContainer.current || !document.contains(formContainer.current)) {
            console.log('Form container not visible or not in DOM, skipping initialization');
            return;
        }

        // Check if already initialized with same formKey
        if (isInitialized && lastFormKey.current === paymentState?.formKey) {
            console.log('Form already initialized with same formKey, skipping...');
            return;
        }

        try {
            isInitializing.current = true;
            setIsLoading(true);
            setError(null);
            
            // Only cleanup if we're reinitializing with a different formKey
            if (lastFormKey.current !== paymentState?.formKey) {
                cleanup();
            }

            // Callback URL'i backend'e yönlendir ve frontend'e yönlendirme parametresi ekle
            const frontendCallbackUrl = window.location.origin + "/checkout/callback";
            const backendCallbackUrl = new URL("http://localhost:8000/api/payment/callback");
            backendCallbackUrl.searchParams.append('method', 'QuickPwi');
            backendCallbackUrl.searchParams.append('redirect', frontendCallbackUrl);
            paymentRequest['callbackUrl'] = backendCallbackUrl.toString();

            const response = await fetch("http://localhost:8000/api/payment/initialize", {
                method: "POST",
                headers: {
                    "Payment-Method": "QuickPwi",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(paymentRequest),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            if (data.status === "failure" || data.status === "error") {
                setError({
                    errorCode: data.errorCode,
                    errorMessage: data.error || data.errorMessage,
                    errorGroup: data.errorGroup,
                });
                return;
            }

            if (!data.data || !data.data.checkoutFormContent) {
                throw new Error("Ödeme formu içeriği alınamadı. Lütfen daha sonra tekrar deneyin.");
            }

            currentToken.current = data.data.token;
            lastFormKey.current = paymentState?.formKey;

            await processFormContent(data.data.checkoutFormContent);

            setIsInitialized(true);
            console.log('Checkout form initialized successfully');

        } catch (err) {
            console.error("Checkout form initialization error:", err);
            setError({
                errorMessage: err.message || "Ödeme formu yüklenirken hata oluştu. Lütfen sayfayı yenileyin.",
                errorCode: "FORM_LOAD_ERROR"
            });
        } finally {
            setIsLoading(false);
            isInitializing.current = false;
        }
    }, [paymentRequest, paymentState?.formKey, cleanup, processFormContent, isInitialized]);

    const handlePaymentComplete = async (response) => {
        try {
            const result = await response.json();
            onPaymentComplete(result);
        } catch (error) {
            console.error('Payment completion error:', error);
            onPaymentComplete({
                status: 'error',
                errorMessage: 'Ödeme işlemi tamamlanırken bir hata oluştu.'
            });
        }
    };

    useEffect(() => {
        // Only initialize if we have paymentRequest, formKey, and the form is visible
        if (paymentRequest && paymentState?.formKey && formContainer.current && document.contains(formContainer.current)) {
            console.log('FormKey changed, initializing form:', paymentState.formKey);
            initializeCheckoutForm();
        }

        return () => {
            isInitializing.current = false;
        };
    }, [paymentState?.formKey, initializeCheckoutForm]);

    useEffect(() => {
        return () => {
            cleanup();
            isInitializing.current = false;
        };
    }, [cleanup]);

    if (error) {
        return (
            <div className="alert alert-danger">
                <h6>Ödeme Formu Hatası</h6>
                {error.errorCode && <p><strong>Hata Kodu:</strong> {error.errorCode}</p>}
                <p><strong>Hata Mesajı:</strong> {error.errorMessage}</p>
                {error.errorGroup && <p><strong>Hata Grubu:</strong> {error.errorGroup}</p>}
                <button
                    className="btn btn-primary mt-2"
                    onClick={() => {
                        setError(null);
                        setIsInitialized(false);
                        lastFormKey.current = null;
                        initializeCheckoutForm();
                    }}
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-form-container">
            <div
                ref={formContainer}
                id="iyzipay-checkout-form"
                className="responsive"
                style={{minHeight: '150px'}}
            />

            {isLoading && (
                <div className="text-center p-4" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p className="mt-2 text-muted">Kayıtlı kartların hazırlanıyor...</p>
                    <small className="text-muted">Bu işlem birkaç saniye sürebilir</small>
                </div>
            )}

            <div className="mt-2 text-muted small">
                Form Key: {paymentState?.formKey} | Token: {currentToken.current ? 'Loaded' : 'Not loaded'} | Initialized: {isInitialized ? 'Yes' : 'No'}
            </div>
        </div>
    );
};

export default QuickPwiForm;