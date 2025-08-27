import React, { useEffect, useState, useRef, useCallback } from "react";

const ApmForm = ({ paymentRequest, paymentState = {}, onPaymentStart, onPaymentComplete }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const formContainer = useRef(null);
    const isInitializing = useRef(false);
    const currentToken = useRef(null);
    const hasInitialized = useRef(false); // Yeni: Initialization kontrolü

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

    // initializeCheckoutForm'u useEffect dışında tanımla
    const initializeCheckoutForm = useCallback(async () => {
        // Guard clauses - erken return
        if (isInitializing.current) {
            console.log('Already initializing, skipping...');
            return;
        }

        if (!paymentRequest) {
            console.log('Missing paymentRequest, skipping initialization');
            return;
        }

        // Eğer zaten initialize edilmişse ve payment link varsa skip et
        if (hasInitialized.current && paymentState?.paymentLink) {
            console.log('Payment already initialized, skipping...');
            setIsLoading(false);
            return;
        }

        try {
            isInitializing.current = true;
            setIsLoading(true);
            setError(null);
            cleanup();

            console.log('Initializing payment request...');

            // Callback URL'i backend'e yönlendir ve frontend'e yönlendirme parametresi ekle
            const frontendCallbackUrl = window.location.origin + "/checkout/callback";
            const backendCallbackUrl = new URL("http://localhost:4000/api/payment/callback");
            backendCallbackUrl.searchParams.append('method', 'Apm');
            backendCallbackUrl.searchParams.append('redirect', frontendCallbackUrl);
            paymentRequest['callbackUrl'] = backendCallbackUrl.toString();

            const response = await fetch("http://localhost:4000/api/payment/initialize", {
                method: "POST",
                headers: {
                    "Payment-Method": "Apm",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(paymentRequest),
            });

            const data = await response.json();

            console.log('API Response:', data); // Debug için eklendi

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

            if (!data.data?.token || !data.data?.payWithIyzicoPageUrl) {
                throw new Error("Ödeme bilgileri alınamadı. Lütfen daha sonra tekrar deneyin.");
            }

            currentToken.current = data.data.token;
            hasInitialized.current = true; // Initialize edildi olarak işaretle

            // Update payment state with the new URL
            if (onPaymentStart) {
                console.log('Payment data being sent to parent:', {
                    paymentLink: data.data.payWithIyzicoPageUrl,
                    token: data.data.token,
                    conversationId: data.data.conversationId,
                    tokenExpireTime: data.data.tokenExpireTime
                }); // Debug için eklendi
                onPaymentStart({
                    paymentLink: data.data.payWithIyzicoPageUrl,
                    token: data.data.token,
                    conversationId: data.data.conversationId,
                    tokenExpireTime: data.data.tokenExpireTime
                });
            }

            console.log('Payment initialized successfully');

        } catch (err) {
            console.error("Payment initialization error:", err);
            setError({
                errorMessage: err.message || "Ödeme formu yüklenirken hata oluştu. Lütfen sayfayı yenileyin.",
                errorCode: "FORM_LOAD_ERROR"
            });
        } finally {
            setIsLoading(false);
            isInitializing.current = false;
        }
    }, [paymentRequest, cleanup, onPaymentStart]); // paymentState dependency'sini kaldır

    // Tek bir useEffect ile kontrol et
    useEffect(() => {
        // Eğer payment request yoksa hiçbir şey yapma
        if (!paymentRequest) {
            setIsLoading(false);
            return;
        }

        // Eğer zaten payment link varsa sadece loading'i kapat
        if (paymentState?.paymentLink && hasInitialized.current) {
            setIsLoading(false);
            return;
        }

        // Eğer henüz initialize edilmemişse başlat
        if (!hasInitialized.current) {
            initializeCheckoutForm();
        }

    }, [paymentRequest, paymentState?.paymentLink]); // initializeCheckoutForm dependency'sini kaldır

    // Cleanup useEffect'i ayrı tut
    useEffect(() => {
        return () => {
            cleanup();
            isInitializing.current = false;
            hasInitialized.current = false; // Reset initialization flag
        };
    }, [cleanup]);

    // Retry function
    const handleRetry = useCallback(() => {
        hasInitialized.current = false; // Reset initialization
        setError(null);
        initializeCheckoutForm();
    }, [initializeCheckoutForm]);

    if (error) {
        return (
            <div className="alert alert-danger">
                <h6>Ödeme Formu Hatası</h6>
                {error.errorCode && <p><strong>Hata Kodu:</strong> {error.errorCode}</p>}
                <p><strong>Hata Mesajı:</strong> {error.errorMessage}</p>
                {error.errorGroup && <p><strong>Hata Grubu:</strong> {error.errorGroup}</p>}
                <button
                    className="btn btn-primary mt-2"
                    onClick={handleRetry}
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-form-container">
            <div id="pwi-column">
                <div id="pwi-sub-column">
                    <div className="pwi-column-title">iyzico Güvencesiyle Kolayca Öde!</div>
                    <p className="pwi-column-text mt-2">iyzico ile Öde-Şimdi Kolay! Alışverişini ister iyzico bakiyenle, ister saklı kartınla, ister havale/EFT yöntemi ile kolayca öde; aklına takılan herhangi bir konuda 7/24 canlı destek al.</p>
                </div>

                <div id="pwi-sub-column">
                    <div id="pwi-flex">
                        <div id="pwi-flex-item">
                            <div className="pwi-column-title">
                                <svg fill="#1E64FF" width="24px" height="24px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <title>cursor-hand-click-line</title>
                                    <path className="clr-i-outline clr-i-outline-path-1" d="M30.4,17.6c-1.8-1.9-4.2-3.2-6.7-3.7c-1.1-0.3-2.2-0.5-3.3-0.6c2.8-3.3,2.3-8.3-1-11.1s-8.3-2.3-11.1,1s-2.3,8.3,1,11.1
                                                    c0.6,0.5,1.2,0.9,1.8,1.1v2.2l-1.6-1.5c-1.4-1.4-3.7-1.4-5.2,0c-1.4,1.4-1.5,3.6-0.1,5l4.6,5.4c0.2,1.4,0.7,2.7,1.4,3.9
                                                    c0.5,0.9,1.2,1.8,1.9,2.5v1.9c0,0.6,0.4,1,1,1h13.6c0.5,0,1-0.5,1-1v-2.6c1.9-2.3,2.9-5.2,2.9-8.1v-5.8
                                                    C30.7,17.9,30.6,17.7,30.4,17.6z M8.4,8.2c0-3.3,2.7-5.9,6-5.8c3.3,0,5.9,2.7,5.8,6c0,1.8-0.8,3.4-2.2,4.5V7.9
                                                    c-0.1-1.8-1.6-3.2-3.4-3.2c-1.8-0.1-3.4,1.4-3.4,3.2v5.2C9.5,12.1,8.5,10.2,8.4,8.2L8.4,8.2z M28.7,24c0.1,2.6-0.8,5.1-2.5,7.1
                                                    c-0.2,0.2-0.4,0.4-0.4,0.7v2.1H14.2v-1.4c0-0.3-0.2-0.6-0.4-0.8c-0.7-0.6-1.3-1.3-1.8-2.2c-0.6-1-1-2.2-1.2-3.4
                                                    c0-0.2-0.1-0.4-0.2-0.6l-4.8-5.7c-0.3-0.3-0.5-0.7-0.5-1.2c0-0.4,0.2-0.9,0.5-1.2c0.7-0.6,1.7-0.6,2.4,0l2.9,2.9v3l1.9-1V7.9
                                                    c0.1-0.7,0.7-1.3,1.5-1.2c0.7,0,1.4,0.5,1.4,1.2v11.5l2,0.4v-4.6c0.1-0.1,0.2-0.1,0.3-0.2c0.7,0,1.4,0.1,2.1,0.2v5.1l1.6,0.3v-5.2
                                                    l1.2,0.3c0.5,0.1,1,0.3,1.5,0.5v5l1.6,0.3v-4.6c0.9,0.4,1.7,1,2.4,1.7L28.7,24z"></path>
                                    <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                                </svg>
                            </div>
                            <p className="pwi-column-text">Kart / Bakiyenle Hızlı Ödeme</p>
                        </div>

                        <div id="pwi-flex-item">
                            <div className="pwi-column-title">
                                <svg fill="#1E64FF" width="24px" height="24px" viewBox="0 0 24 24" id="secure" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" className="icon flat-color"><path id="primary" d="M19.42,3.83,12.24,2a1,1,0,0,0-.48,0L4.58,3.83A2,2,0,0,0,3.07,5.92l.42,5.51a12,12,0,0,0,7.24,10.11l.88.38a1,1,0,0,0,.78,0l.88-.38a12,12,0,0,0,7.24-10.11l.42-5.51A2,2,0,0,0,19.42,3.83Z" style={{ fill: "rgb(30, 100, 255)" }}></path><path id="secondary" d="M11,14a1,1,0,0,1-.71-.29l-2-2a1,1,0,0,1,1.42-1.42L11,11.59l3.29-3.3a1,1,0,0,1,1.42,1.42l-4,4A1,1,0,0,1,11,14Z" style={{ fill: "rgb(255, 255, 255)" }}></path></svg>
                            </div>
                            <p className="pwi-column-text">Korumalı Alışveriş</p>
                        </div>

                        <div id="pwi-flex-item">
                            <div className="pwi-column-title">
                                <svg fill="#1E64FF" width="24px" height="24px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <title>wallet-solid</title>
                                    <path className="clr-i-solid clr-i-solid-path-1" d="M32.94,14H31V9a1,1,0,0,0-1-1H6A1,1,0,0,1,5,7H5V7A1,1,0,0,1,6,6H29.6a1,1,0,1,0,0-2H6A2.94,2.94,0,0,0,3,6.88v21A4.13,4.13,0,0,0,7.15,32H30a1,1,0,0,0,1-1V26h1.94a.93.93,0,0,0,1-.91v-10A1.08,1.08,0,0,0,32.94,14ZM32,24l-8.58,0a3.87,3.87,0,0,1-3.73-4,3.87,3.87,0,0,1,3.73-4L32,16Z"></path><circle className="clr-i-solid clr-i-solid-path-2" cx="24.04" cy="19.92" r="1.5"></circle>
                                    <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                                </svg>
                            </div>
                            <p className="pwi-column-text">Bakiye ile Ödemende Anında İade</p>
                        </div>

                        <div id="pwi-flex-item">
                            <div className="pwi-column-title">
                                <svg width="24px" height="24px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <title>support</title>
                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="support" fill="#1E64FF" transform="translate(42.666667, 42.666667)">
                                            <path d="M379.734355,174.506667 C373.121022,106.666667 333.014355,-2.13162821e-14 209.067688,-2.13162821e-14 C85.1210217,-2.13162821e-14 45.014355,106.666667 38.4010217,174.506667 C15.2012632,183.311569 -0.101643453,205.585799 0.000508304259,230.4 L0.000508304259,260.266667 C0.000508304259,293.256475 26.7445463,320 59.734355,320 C92.7241638,320 119.467688,293.256475 119.467688,260.266667 L119.467688,230.4 C119.360431,206.121456 104.619564,184.304973 82.134355,175.146667 C86.4010217,135.893333 107.307688,42.6666667 209.067688,42.6666667 C310.827688,42.6666667 331.521022,135.893333 335.787688,175.146667 C313.347976,184.324806 298.68156,206.155851 298.667688,230.4 L298.667688,260.266667 C298.760356,283.199651 311.928618,304.070103 332.587688,314.026667 C323.627688,330.88 300.801022,353.706667 244.694355,360.533333 C233.478863,343.50282 211.780225,336.789048 192.906491,344.509658 C174.032757,352.230268 163.260418,372.226826 167.196286,392.235189 C171.132153,412.243552 188.675885,426.666667 209.067688,426.666667 C225.181549,426.577424 239.870491,417.417465 247.041022,402.986667 C338.561022,392.533333 367.787688,345.386667 376.961022,317.653333 C401.778455,309.61433 418.468885,286.351502 418.134355,260.266667 L418.134355,230.4 C418.23702,205.585799 402.934114,183.311569 379.734355,174.506667 Z M76.8010217,260.266667 C76.8010217,269.692326 69.1600148,277.333333 59.734355,277.333333 C50.3086953,277.333333 42.6676884,269.692326 42.6676884,260.266667 L42.6676884,230.4 C42.6676884,224.302667 45.9205765,218.668499 51.2010216,215.619833 C56.4814667,212.571166 62.9872434,212.571166 68.2676885,215.619833 C73.5481336,218.668499 76.8010217,224.302667 76.8010217,230.4 L76.8010217,260.266667 Z M341.334355,230.4 C341.334355,220.97434 348.975362,213.333333 358.401022,213.333333 C367.826681,213.333333 375.467688,220.97434 375.467688,230.4 L375.467688,260.266667 C375.467688,269.692326 367.826681,277.333333 358.401022,277.333333 C348.975362,277.333333 341.334355,269.692326 341.334355,260.266667 L341.334355,230.4 Z"></path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <p className="pwi-column-text">7/24 Canlı Destek</p>
                        </div>

                        <div id="pwi-flex-item">
                            <div className="pwi-column-title">
                                <svg fill="#1E64FF" width="24px" height="24px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 9.6249 47.7109 L 46.3751 47.7109 C 51.2735 47.7109 53.7344 45.2969 53.7344 40.4687 L 53.7344 15.5547 C 53.7344 10.7266 51.2735 8.2891 46.3751 8.2891 L 9.6249 8.2891 C 4.7265 8.2891 2.2656 10.7266 2.2656 15.5547 L 2.2656 40.4687 C 2.2656 45.2969 4.7265 47.7109 9.6249 47.7109 Z M 6.0390 15.7656 C 6.0390 13.3281 7.3515 12.0625 9.6952 12.0625 L 46.3280 12.0625 C 48.6484 12.0625 49.9607 13.3281 49.9607 15.7656 L 49.9607 17.7344 L 6.0390 17.7344 Z M 9.6952 43.9375 C 7.3515 43.9375 6.0390 42.6953 6.0390 40.2578 L 6.0390 23.0547 L 49.9607 23.0547 L 49.9607 40.2578 C 49.9607 42.6953 48.6484 43.9375 46.3280 43.9375 Z M 12.3905 37.0000 L 18.1327 37.0000 C 19.5156 37.0000 20.4296 36.0859 20.4296 34.7500 L 20.4296 30.4140 C 20.4296 29.1015 19.5156 28.1640 18.1327 28.1640 L 12.3905 28.1640 C 11.0078 28.1640 10.0937 29.1015 10.0937 30.4140 L 10.0937 34.7500 C 10.0937 36.0859 11.0078 37.0000 12.3905 37.0000 Z" /></svg>
                            </div>
                            <p className="pwi-column-text">Alışveriş Kredisi</p>
                        </div>
                    </div>
                </div>
            </div>

            {console.log('Current paymentState:', paymentState)}

            {paymentState?.paymentLink && (
                <div className="mt-4 text-center">
                    <a href={paymentState.paymentLink} target="_blank" rel="noopener noreferrer" className="btn btn-soft-primary w-100 d-flex align-items-center justify-content-center">
                        <svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" className="me-2">
                            <g id="layer1">
                                <path d="M 10 0 L 9.4375 0.40234375 L 8.8613281 0.77539062 L 8.2636719 1.1230469 L 7.6542969 1.4433594 L 7.0292969 1.734375 L 6.390625 1.9960938 L 5.7421875 2.2304688 L 5.0839844 2.4335938 L 4.4179688 2.6054688 L 3.7421875 2.7480469 L 3.0605469 2.8574219 L 2.3769531 2.9355469 L 1.6894531 2.984375 L 1 3 L 1.015625 3.8339844 L 1.0664062 4.6660156 L 1.1503906 5.4960938 L 1.2695312 6.3222656 L 1.421875 7.1425781 L 1.6054688 7.9550781 L 1.8222656 8.7597656 L 2.0722656 9.5546875 L 2.3535156 10.339844 L 2.6679688 11.113281 L 3.0136719 11.873047 L 3.3886719 12.617188 L 3.7929688 13.347656 L 4.2265625 14.058594 L 4.6894531 14.751953 L 5.1816406 15.427734 L 5.6992188 16.082031 L 6.2421875 16.712891 L 6.8105469 17.322266 L 7.4042969 17.910156 L 8.0214844 18.470703 L 8.6601562 19.007812 L 9.3203125 19.517578 L 10 20 L 10.679688 19.517578 L 11.339844 19.007812 L 11.978516 18.470703 L 12.595703 17.910156 L 13.189453 17.322266 L 13.757812 16.712891 L 14.300781 16.082031 L 14.818359 15.427734 L 15.308594 14.751953 L 15.771484 14.058594 L 16.207031 13.347656 L 16.611328 12.617188 L 16.986328 11.873047 L 17.332031 11.113281 L 17.644531 10.339844 L 17.925781 9.5546875 L 18.175781 8.7597656 L 18.394531 7.9550781 L 18.580078 7.1425781 L 18.730469 6.3222656 L 18.849609 5.4960938 L 18.933594 4.6660156 L 18.984375 3.8339844 L 19 3 L 18.310547 2.984375 L 17.623047 2.9355469 L 16.939453 2.8574219 L 16.257812 2.7480469 L 15.582031 2.6054688 L 14.916016 2.4335938 L 14.257812 2.2304688 L 13.607422 1.9960938 L 12.970703 1.734375 L 12.345703 1.4433594 L 11.734375 1.1230469 L 11.138672 0.77539062 L 10.560547 0.40234375 L 10 0 z M 10 1.2285156 L 10.597656 1.6152344 L 11.210938 1.9746094 L 11.837891 2.3085938 L 12.482422 2.6132812 L 13.136719 2.8867188 L 13.804688 3.1328125 L 14.482422 3.3496094 L 15.169922 3.5332031 L 15.863281 3.6894531 L 16.5625 3.8125 L 17.267578 3.90625 L 17.976562 3.96875 L 17.921875 4.7558594 L 17.833984 5.5410156 L 17.716797 6.3242188 L 17.566406 7.0996094 L 17.384766 7.8691406 L 17.171875 8.6308594 L 16.929688 9.3808594 L 16.658203 10.123047 L 16.353516 10.853516 L 16.023438 11.570312 L 15.662109 12.273438 L 15.273438 12.960938 L 14.855469 13.632812 L 14.414062 14.289062 L 13.945312 14.923828 L 13.451172 15.541016 L 12.931641 16.136719 L 12.388672 16.710938 L 11.824219 17.263672 L 11.236328 17.791016 L 10.626953 18.296875 L 10 18.777344 L 9.3730469 18.296875 L 8.7636719 17.791016 L 8.1777344 17.263672 L 7.6113281 16.710938 L 7.0683594 16.136719 L 6.5488281 15.541016 L 6.0566406 14.923828 L 5.5859375 14.289062 L 5.1445312 13.632812 L 4.7265625 12.960938 L 4.3378906 12.273438 L 3.9785156 11.570312 L 3.6445312 10.853516 L 3.34375 10.123047 L 3.0703125 9.3808594 L 2.828125 8.6308594 L 2.6152344 7.8691406 L 2.4335938 7.0996094 L 2.2832031 6.3242188 L 2.1660156 5.5410156 L 2.078125 4.7558594 L 2.0234375 3.96875 L 2.7304688 3.90625 L 3.4355469 3.8125 L 4.1367188 3.6894531 L 4.8320312 3.5332031 L 5.5175781 3.3496094 L 6.1953125 3.1328125 L 6.8632812 2.8867188 L 7.5175781 2.6132812 L 8.1621094 2.3085938 L 8.7910156 1.9746094 L 9.4023438 1.6152344 L 10 1.2285156 z M 10 5 C 8.9013528 5 8 5.9013528 8 7 L 8 8 L 7 8 L 7 8.5 L 7 13 L 13 13 L 13 8 L 12 8 L 12 7.0351562 C 12.000412 7.0234413 12.000412 7.011715 12 7 C 12 5.9013528 11.098647 5 10 5 z M 10 6 C 10.558207 6 11 6.441793 11 7 L 11 8 L 9 8 L 9 7.0351562 C 9.0004121 7.0234413 9.0004121 7.011715 9 7 C 9 6.441793 9.441793 6 10 6 z M 8 9 L 12 9 L 12 12 L 8 12 L 8 9 z " style={{ fill: "#1E64FF", fillOpacity: 1, stroke: "none", strokeWidth: "0px" }} />
                            </g>
                        </svg> 
                        iyzico güvencesi ile ödeme
                    </a>
                </div>
            )}

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
                    <p className="mt-2 text-muted">Apm Payment Link hazırlanıyor...</p>
                    <small className="text-muted">Bu işlem birkaç saniye sürebilir</small>
                </div>
            )}

            <div className="mt-2 text-muted small">
                Form Key: {paymentState?.formKey} | Token: {currentToken.current ? 'Loaded' : 'Not loaded'}
            </div>

            <style jsx>{`
                .pwi-column-title {
                    font-size: 1.25rem;
                    line-height: 1.5rem;
                    font-weight: 600;
                }
                #pwi-sub-column {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                #pwi-flex {
                    display: flex;
                    gap: 20px;
                }
                #pwi-flex-item {
                    background: #F6F7F8;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    border-radius: 20px;
                    width: calc(20% - 16px);
                    text-align: center;
                    font-weight: 600;
                }
                .pwi-column-text {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                /* Buton hover durumunda SVG'yi beyaz yap */
                .btn-soft-primary:hover svg {
                    filter: brightness(0) invert(1);
                }
            `}</style>
        </div>
    );
};

export default ApmForm;