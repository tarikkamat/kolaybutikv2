<?php

    namespace App\Mapper;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use App\Http\Requests\CaptureRequest;
    use InvalidArgumentException;
    use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
    use Iyzipay\Request\CreatePaymentRequest;
    use Iyzipay\Request\CreatePayWithIyzicoInitializeRequest;
    use Iyzipay\Request\RetrieveCheckoutFormRequest;
    use Iyzipay\Request\RetrievePayWithIyzicoRequest;
    use Iyzipay\Request\RetrievePaymentRequest;
    use Iyzipay\Request\CreateThreedsPaymentRequest;

    final readonly class RequestMapper extends BaseMapper
    {
        public function toRequest(
            InitializeRequest|RetrieveRequest|CaptureRequest $request,
            string $requestType
        ): CreatePayWithIyzicoInitializeRequest|CreateCheckoutFormInitializeRequest|CreatePaymentRequest|RetrieveCheckoutFormRequest|RetrievePayWithIyzicoRequest|RetrievePaymentRequest|CreateThreedsPaymentRequest {
            return match ($requestType) {
                'CheckoutFormMethod' => $this->checkoutFormRequest($request),
                'ApmMethod' => $this->apmRequest($request),
                'CreditCardMethod', 'ThreeDSecureMethod' => $this->creditCardRequest($request),
                'ThreeDSecureCapture' => $this->threeDSecureCaptureRequest($request),
                'RetrieveCheckoutForm' => $this->retrieveCheckoutFormRequest($request),
                'RetrieveApm' => $this->retrieveApmRequest($request),
                'RetrieveThreeDSecure', 'RetrieveCreditCard' => $this->retrieveCreditCardRequest($request),
                default => throw new InvalidArgumentException("Unsupported request type: {$requestType}"),
            };
        }

        private function checkoutFormRequest(InitializeRequest $initializeRequest): CreateCheckoutFormInitializeRequest
        {
            $checkoutFormRequest = new CreateCheckoutFormInitializeRequest();

            $this->setBasicPaymentInformation($checkoutFormRequest, $initializeRequest);
            $this->setCommonRequestData($checkoutFormRequest, $initializeRequest);

            return $checkoutFormRequest;
        }

        private function apmRequest(InitializeRequest $initializeRequest): CreatePayWithIyzicoInitializeRequest
        {
            $apmRequest = new CreatePayWithIyzicoInitializeRequest();

            $this->setBasicPaymentInformation($apmRequest, $initializeRequest);
            $this->setCommonRequestData($apmRequest, $initializeRequest);

            return $apmRequest;
        }

        private function creditCardRequest(InitializeRequest $initializeRequest): CreatePaymentRequest
        {
            $creditCardRequest = new CreatePaymentRequest();

            $this->setBasicPaymentInformation($creditCardRequest, $initializeRequest);
            $this->setCommonRequestData($creditCardRequest, $initializeRequest);
            $this->setCreditCardInformation($creditCardRequest, $initializeRequest);

            return $creditCardRequest;
        }

        private function retrieveCheckoutFormRequest(RetrieveRequest $retrieveRequest): RetrieveCheckoutFormRequest
        {
            $retrieveCheckoutFormRequest = new RetrieveCheckoutFormRequest();

            $retrieveCheckoutFormRequest->setToken($retrieveRequest->token);
            $retrieveCheckoutFormRequest->setLocale($retrieveRequest->locale);
            $retrieveCheckoutFormRequest->setConversationId($retrieveRequest->conversationId);

            return $retrieveCheckoutFormRequest;
        }

        private function retrieveApmRequest(RetrieveRequest $retrieveRequest): RetrievePayWithIyzicoRequest
        {
            $retrieveApmRequest = new RetrievePayWithIyzicoRequest();

            $retrieveApmRequest->setToken($retrieveRequest->token);
            $retrieveApmRequest->setLocale($retrieveRequest->locale);
            $retrieveApmRequest->setConversationId($retrieveRequest->conversationId);

            return $retrieveApmRequest;
        }

        private function retrieveCreditCardRequest(RetrieveRequest $retrieveRequest): RetrievePaymentRequest
        {
            $retrieveCreditCardRequest = new RetrievePaymentRequest();

            $retrieveCreditCardRequest->setPaymentId($retrieveRequest->paymentId);
            $retrieveCreditCardRequest->setPaymentConversationId($retrieveRequest->paymentConversationId);
            $retrieveCreditCardRequest->setLocale($retrieveRequest->locale);
            $retrieveCreditCardRequest->setConversationId($retrieveRequest->conversationId);

            return $retrieveCreditCardRequest;
        }

        private function threeDSecureCaptureRequest(CaptureRequest $captureRequest): CreateThreedsPaymentRequest
        {
            $threeDSecureCaptureRequest = new CreateThreedsPaymentRequest();

            $threeDSecureCaptureRequest->setPaymentId($captureRequest->paymentId);
            $threeDSecureCaptureRequest->setPaymentConversationId($captureRequest->paymentConversationId);
            $threeDSecureCaptureRequest->setLocale($captureRequest->locale);
            $threeDSecureCaptureRequest->setConversationId($captureRequest->conversationId);
            $threeDSecureCaptureRequest->setConversationData($captureRequest->conversationData);

            return $threeDSecureCaptureRequest;
        }
    }
