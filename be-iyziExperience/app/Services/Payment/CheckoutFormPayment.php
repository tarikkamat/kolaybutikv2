<?php

    namespace App\Services\Payment;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use App\Mapper\RequestMapper;
    use Exception;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Support\Facades\Log;
    use Iyzipay\Model\CheckoutForm;
    use Iyzipay\Model\CheckoutFormInitialize;
    use Iyzipay\Options;

    readonly class CheckoutFormPayment implements PaymentStrategyInterface
    {
        public function __construct(private RequestMapper $requestMapper)
        {
        }

        public function initialize(InitializeRequest $request): JsonResponse
        {
            try {
                $checkoutFormRequest = $this->requestMapper->toRequest($request, 'CheckoutFormMethod');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $checkoutFormResponse = CheckoutFormInitialize::create($checkoutFormRequest, $options);

                if ($checkoutFormResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'data' => [
                            'paymentPageUrl' => $checkoutFormResponse->getPaymentPageUrl(),
                            'checkoutFormContent' => $checkoutFormResponse->getCheckoutFormContent(),
                            'token' => $checkoutFormResponse->getToken(),
                            'signature' => $checkoutFormResponse->getSignature()
                        ]
                    ]);
                }

                Log::error('CheckoutForm Initialize Error', [
                    'status' => $checkoutFormResponse->getStatus(),
                    'errorCode' => $checkoutFormResponse->getErrorCode(),
                    'errorMessage' => $checkoutFormResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'error' => 'Ödeme başlatılamadı: '.$checkoutFormResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('CheckoutFormPayment exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }

        public function retrieve(RetrieveRequest $request): JsonResponse
        {
            try {
                $retrieveCheckoutFormRequest = $this->requestMapper->toRequest($request, 'RetrieveCheckoutForm');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $retrieveCheckoutFormResponse = CheckoutForm::retrieve($retrieveCheckoutFormRequest, $options);

                if ($retrieveCheckoutFormResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'conversationId' => $retrieveCheckoutFormResponse->getConversationId(),
                        'paymentId' => $retrieveCheckoutFormResponse->getPaymentId(),
                        'paymentStatus' => $retrieveCheckoutFormResponse->getPaymentStatus(),
                    ]);
                }

                Log::error('CheckoutFormPayment retrieve error', [
                    'status' => $retrieveCheckoutFormResponse->getStatus(),
                    'errorCode' => $retrieveCheckoutFormResponse->getErrorCode(),
                    'errorMessage' => $retrieveCheckoutFormResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'error' => 'Ödeme bilgileri alınamadı: '.$retrieveCheckoutFormResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('CheckoutFormPayment exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }
    }
