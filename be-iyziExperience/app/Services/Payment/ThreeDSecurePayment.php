<?php

    namespace App\Services\Payment;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\CaptureRequest;
    use App\Http\Requests\RetrieveRequest;
    use App\Mapper\RequestMapper;
    use Exception;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Support\Facades\Log;
    use Iyzipay\Model\ThreedsInitialize;
    use Iyzipay\Model\ThreedsPayment;
    use Iyzipay\Options;
    use Illuminate\Support\Facades\Cache;

    readonly class ThreeDSecurePayment implements PaymentStrategyInterface
    {
        public function __construct(private RequestMapper $requestMapper)
        {
        }

        public function initialize(InitializeRequest $request): JsonResponse
        {
            try {
                $threeDSecureRequest = $this->requestMapper->toRequest($request, 'ThreeDSecureMethod');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $threeDSecureRequestResponse = ThreedsInitialize::create($threeDSecureRequest, $options);

                if ($threeDSecureRequestResponse->getStatus() === 'success') {
                    $paymentId = $threeDSecureRequestResponse->getPaymentId();

                    Cache::put('payment_3ds_' . $paymentId, $threeDSecureRequestResponse->getHtmlContent(), now()->addMinutes(30));

                    $verificationUrl = route('payment.verification', ['paymentId' => $paymentId]);

                    Log::info('ThreeDSecure Initialize Success', [
                        'conversationId' => $threeDSecureRequestResponse->getConversationId(),
                        'paymentId' => $paymentId,
                        'threeDSHtmlContent' => $threeDSecureRequestResponse->getHtmlContent(),
                        'verificationUrl' => $verificationUrl
                    ]);

                    return response()->json([
                        'success' => true,
                        'data' => [
                            'conversationId' => $threeDSecureRequestResponse->getConversationId(),
                            'paymentId' => $paymentId,
                            'threeDSHtmlContent' => $threeDSecureRequestResponse->getHtmlContent(),
                            'verificationUrl' => $verificationUrl
                        ]
                    ]);
                }

                Log::error('ThreeDSecure Initialize Error', [
                    'status' => $threeDSecureRequestResponse->getStatus(),
                    'errorCode' => $threeDSecureRequestResponse->getErrorCode(),
                    'errorMessage' => $threeDSecureRequestResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Ödeme başlatılamadı: '.$threeDSecureRequestResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('ThreeDSecure exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }


        public function capture(CaptureRequest $request): JsonResponse
        {
            try {
                $threeDSecureRequest = $this->requestMapper->toRequest($request, 'ThreeDSecureCapture');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $threeDSecureCaptureResponse = ThreedsPayment::create($threeDSecureRequest, $options);

                if ($threeDSecureCaptureResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'data' => [
                            'conversationId' => $threeDSecureCaptureResponse->getConversationId(),
                            'paymentId' => $threeDSecureCaptureResponse->getPaymentId(),
                            'paymentStatus' => $threeDSecureCaptureResponse->getPaymentStatus()
                        ]
                    ]);
                }

                Log::error('ThreeDSecureCapture Error', [
                    'status' => $threeDSecureCaptureResponse->getStatus(),
                    'errorCode' => $threeDSecureCaptureResponse->getErrorCode(),
                    'errorMessage' => $threeDSecureCaptureResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Ödeme tamamlanmadı: '.$threeDSecureCaptureResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('ThreeDSecureCapture exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }

        public function retrieve(RetrieveRequest $request): JsonResponse
        {
            try {
                $retrieveThreeDSecureRequest = $this->requestMapper->toRequest($request, 'RetrieveThreeDSecure');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $retrieveThreeDSecureResponse = ThreedsPayment::retrieve($retrieveThreeDSecureRequest, $options);

                if ($retrieveThreeDSecureResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'conversationId' => $retrieveThreeDSecureResponse->getConversationId(),
                        'paymentId' => $retrieveThreeDSecureResponse->getPaymentId(),
                        'paymentStatus' => $retrieveThreeDSecureResponse->getPaymentStatus()
                    ]);
                }

                Log::error('ThreeDSecurePayment retrieve error', [
                    'status' => $retrieveThreeDSecureResponse->getStatus(),
                    'errorCode' => $retrieveThreeDSecureResponse->getErrorCode(),
                    'errorMessage' => $retrieveThreeDSecureResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'error' => 'Ödeme bilgileri alınamadı: '.$retrieveThreeDSecureResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('ThreeDSecurePayment exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }
    }

