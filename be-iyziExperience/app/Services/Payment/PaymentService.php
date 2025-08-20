<?php

    namespace App\Services\Payment;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use Illuminate\Http\JsonResponse;

    readonly class PaymentService
    {
        public function __construct(
            private CheckoutFormPayment $checkoutFormPayment,
            private QuickPWIPayment $quickPWIPayment,
            private ApmPayment $apmPayment,
            private CreditCardPayment $creditCardPayment,
            private ThreeDSecurePayment $threeDSecurePayment
        ) {
        }

        public function initialize(string $method, InitializeRequest $request): JsonResponse
        {
            return match ($method) {
                'CheckoutForm' => $this->checkoutFormPayment->initialize($request),
                'QuickPwi' => $this->quickPWIPayment->initialize($request),
                'Apm' => $this->apmPayment->initialize($request),
                'CreditCard' => $this->creditCardPayment->initialize($request),
                'ThreeDSecure' => $this->threeDSecurePayment->initialize($request),
                default => response()->json(['error' => 'Unsupported payment method'], 405),
            };
        }

        public function retrieve(string $method, RetrieveRequest $request): JsonResponse
        {
            return match ($method) {
                'CheckoutForm' => $this->checkoutFormPayment->retrieve($request),
                'Apm' => $this->apmPayment->retrieve($request),
                'QuickPwi' => $this->quickPWIPayment->retrieve($request),
                'CreditCard' => $this->creditCardPayment->retrieve($request),
                'ThreeDSecure' => $this->threeDSecurePayment->retrieve($request),
                default => response()->json(['error' => 'Unsupported payment method'], 405),
            };
        }

        public function capture(string $method, CaptureRequest $request): JsonResponse
        {
            return match ($method) {
                'ThreeDSecure' => $this->threeDSecurePayment->capture($request),
                default => response()->json(['error' => 'Unsupported payment method'], 405),
            };
        }
    }
