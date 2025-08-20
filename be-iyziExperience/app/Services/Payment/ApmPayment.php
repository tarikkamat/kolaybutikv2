<?php

    namespace App\Services\Payment;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use App\Mapper\RequestMapper;
    use Exception;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Support\Facades\Log;
    use Iyzipay\Model\PayWithIyzico;
    use Iyzipay\Model\PayWithIyzicoInitialize;
    use Iyzipay\Options;

    readonly class ApmPayment implements PaymentStrategyInterface
    {
        public function __construct(private RequestMapper $requestMapper)
        {
        }

        public function initialize(InitializeRequest $request): JsonResponse
        {
            try {
                $apmRequest = $this->requestMapper->toRequest($request, 'ApmMethod');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $apmResponse = PayWithIyzicoInitialize::create($apmRequest, $options);

                if ($apmResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'data' => [
                            'payWithIyzicoPageUrl' => $apmResponse->getPayWithIyzicoPageUrl(),
                            'token' => $apmResponse->getToken(),
                            'signature' => $apmResponse->getSignature(),
                        ]
                    ]);
                }

                Log::error('Apm Initialize Error', [
                    'status' => $apmResponse->getStatus(),
                    'errorCode' => $apmResponse->getErrorCode(),
                    'errorMessage' => $apmResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Ödeme başlatılamadı: '.$apmResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('CheckoutFormPayment exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }

        public function retrieve(RetrieveRequest $request): JsonResponse
        {
            try {
                $retrieveApmRequest = $this->requestMapper->toRequest($request, 'RetrieveApm');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $retrieveApmResponse = PayWithIyzico::retrieve($retrieveApmRequest, $options);

                if ($retrieveApmResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'conversationId' => $retrieveApmResponse->getConversationId(),
                        'paymentId' => $retrieveApmResponse->getPaymentId(),
                        'paymentStatus' => $retrieveApmResponse->getPaymentStatus(),
                    ]);
                }

                Log::error('ApmPayment retrieve error', [
                    'status' => $retrieveApmResponse->getStatus(),
                    'errorCode' => $retrieveApmResponse->getErrorCode(),
                    'errorMessage' => $retrieveApmResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'error' => 'Ödeme bilgileri alınamadı: '.$retrieveApmResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('ApmPayment exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }


    }

