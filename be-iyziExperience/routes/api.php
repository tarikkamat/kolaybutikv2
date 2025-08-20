<?php

    use App\Http\Controllers\PaymentController;
    use Illuminate\Support\Facades\Route;

    Route::post('/payment/initialize', [PaymentController::class, 'initialize']);
    Route::post('/payment/retrieve', [PaymentController::class, 'retrieve']);
    Route::post('/payment/callback', [PaymentController::class, 'callback']);
