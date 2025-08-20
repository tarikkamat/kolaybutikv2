<?php

    namespace App\Http\Controllers;

    use App\Http\Requests\CaptureRequest;
    use App\Http\Requests\InitializeRequest;
    use App\Http\Requests\RetrieveRequest;
    use App\Services\Payment\PaymentService;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Http\Request;
    use Illuminate\Support\Str;

    class PaymentController extends Controller
    {
        public function __construct(private readonly PaymentService $paymentService)
        {
        }

        public function initialize(InitializeRequest $request): JsonResponse
        {
            $method = $request->header('Payment-Method');
            return $this->paymentService->initialize($method, $request);
        }

        public function retrieve(RetrieveRequest $request): JsonResponse
        {
            $method = $request->header('Payment-Method');
            return $this->paymentService->retrieve($method, $request);
        }

        public function capture(CaptureRequest $request): JsonResponse
        {
            $method = $request->header('Payment-Method');
            return $this->paymentService->capture($method, $request);
        }

        public function callback(Request $request)
        {
            $retrieveRequest = new RetrieveRequest();

            if($request->has('token')){
                $retrieveRequest->merge([
                    'token' => $request->input('token'),
                ]);

                $method = $request->query('method', 'CheckoutForm');
                $redirect = $request->query('redirect');

                $result = $this->paymentService->retrieve($method, $retrieveRequest);

                // Eğer redirect URL'i varsa, frontend'e yönlendir
                if ($redirect) {
                    $redirectUrl = $redirect;
                    $redirectUrl .= (parse_url($redirect, PHP_URL_QUERY) ? '&' : '?') . http_build_query([
                            'token' => $request->input('token'),
                            'method' => $method
                        ]);

                    return redirect()->away($redirectUrl);
                }

                return $result;
            }

            return response()->json(['error' => 'Invalid callback request'], 400);
        }
    }
