<?php

    namespace App\Services\Payment;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use App\Mapper\RequestMapper;
    use Exception;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Support\Facades\Log;
    use Iyzipay\Model\Payment;
    use Iyzipay\Options;

    readonly class CreditCardPayment implements PaymentStrategyInterface
    {
        public function __construct(private RequestMapper $requestMapper)
        {
        }

        public function initialize(InitializeRequest $request): JsonResponse
        {
            try {
                $creditCardRequest = $this->requestMapper->toRequest($request, 'CreditCardMethod');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $creditCardResponse = Payment::create($creditCardRequest, $options);

                if ($creditCardResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => $creditCardResponse->getStatus(),
                        'signature' => $creditCardResponse->getSignature(),
                        'paymentId' => $creditCardResponse->getPaymentId(),
                        'conversationId' => $creditCardResponse->getConversationId(),
                        'paymentStatus' => 'SUCCESS',
                    ]);
                }

                Log::error('CreditCard Initialize Error', [
                    'status' => $creditCardResponse->getStatus(),
                    'errorCode' => $creditCardResponse->getErrorCode(),
                    'errorMessage' => $creditCardResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'error' => 'Ödeme tamamlanmadı: '.$creditCardResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('CreditCard exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }

        public function retrieve(RetrieveRequest $request): JsonResponse
        {
            try {
                $retrieveCreditCardRequest = $this->requestMapper->toRequest($request, 'RetrieveCreditCard');

                $options = new Options();
                $options->setBaseUrl(config('services.iyzipay.base_url'));
                $options->setApiKey(config('services.iyzipay.api_key'));
                $options->setSecretKey(config('services.iyzipay.secret_key'));

                $retrieveCreditCardResponse = Payment::retrieve($retrieveCreditCardRequest, $options);

                if ($retrieveCreditCardResponse->getStatus() === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'conversationId' => $retrieveCreditCardResponse->getConversationId(),
                        'paymentId' => $retrieveCreditCardResponse->getPaymentId(),
                        'paymentStatus' => $retrieveCreditCardResponse->getPaymentStatus(),
                        'paymentConversationId' => $retrieveCreditCardResponse->getPaymentConversationId(),
                    ]);
                }

                Log::error('CreditCardPayment retrieve error', [
                    'status' => $retrieveCreditCardResponse->getStatus(),
                    'errorCode' => $retrieveCreditCardResponse->getErrorCode(),
                    'errorMessage' => $retrieveCreditCardResponse->getErrorMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'error' => 'Ödeme bilgileri alınamadı: '.$retrieveCreditCardResponse->getErrorMessage()
                ], 400);

            } catch (Exception $e) {
                Log::error('CreditCardPayment exception', ['error' => $e->getMessage()]);
                return response()->json(['success' => false, 'error' => 'Sistem hatası.'], 500);
            }
        }

    }

