<?php

    namespace App\Services\Payment;

    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use Illuminate\Http\JsonResponse;

    interface PaymentStrategyInterface
    {
        public function initialize(InitializeRequest $request): JsonResponse;
        public function retrieve(RetrieveRequest $request): JsonResponse;
    }
