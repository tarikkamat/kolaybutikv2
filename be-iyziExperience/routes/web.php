<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/payment/{paymentId}/verification', function ($paymentId) {
    $htmlContent = Cache::get('payment_3ds_' . $paymentId);

    if (!$htmlContent) {
        abort(404, 'Payment verification content not found');
    }

    return view('ThreeDSecureVerifyExample', [
        'ThreeDSecurePaymentHtmlContent' => $htmlContent
    ]);
})->name('payment.verification');
