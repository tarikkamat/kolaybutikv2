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

    readonly class QuickPWIPayment implements PaymentStrategyInterface
    {
        public function __construct(private RequestMapper $requestMapper)
        {
        }

        public function initialize(InitializeRequest $request): JsonResponse
        {
            try {
                $checkoutFormRequest = $this->requestMapper->toRequest($request, 'CheckoutFormMethod');
                $buyer = $checkoutFormRequest->getBuyer();
                $buyer->setGsmNumber('+905309720000');
                $checkoutFormRequest->setBuyer($buyer);

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey('sandbox-t1lWRrN28GGhrKzAPOVwCJcU1LMafLab');
                $options->setSecretKey('sandbox-yi3WsZlLT2gXwlBZ4mHNlq8zgOJ1McpG');

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
                $options->setApiKey('sandbox-t1lWRrN28GGhrKzAPOVwCJcU1LMafLab');
                $options->setSecretKey('sandbox-yi3WsZlLT2gXwlBZ4mHNlq8zgOJ1McpG');

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
