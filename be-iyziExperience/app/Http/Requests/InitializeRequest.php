<?php

    namespace App\Http\Requests;

    use Illuminate\Foundation\Http\FormRequest;

    class InitializeRequest extends FormRequest
    {
        public function authorize(): bool
        {
            return true;
        }

        public function rules(): array
        {
            $rules = [
                // Header Rules
                'Payment-Method' => 'required|string|in:CheckoutForm,Apm,CreditCard,CardToken,ThreeDSecure,QuickPwi',

                // General Rules
                'locale' => 'required|string|in:tr,en',
                'conversationId' => 'required|string|max:255',
                'price' => 'required|numeric|min:0.01|max:999999.99',
                'paidPrice' => 'required|numeric|min:0.01|max:999999.99',
                'currency' => 'required|string|in:TRY,USD,EUR,GBP',
                'basketId' => 'required|string|max:255',
                'paymentGroup' => 'required|string|in:PRODUCT,LISTING,SUBSCRIPTION',

                // Buyer Rules
                'buyer' => 'required|array',
                'buyer.id' => 'required|string|max:255',
                'buyer.name' => 'required|string',
                'buyer.surname' => 'required|string',
                'buyer.gsmNumber' => 'required|string|regex:/^\+?[1-9]\d{1,14}$/',
                'buyer.email' => 'required|email|max:255',
                'buyer.identityNumber' => 'required|string|digits:11',
                'buyer.lastLoginDate' => 'nullable|date_format:Y-m-d H:i:s|before_or_equal:now',
                'buyer.registrationDate' => 'nullable|date_format:Y-m-d H:i:s|before_or_equal:now',
                'buyer.registrationAddress' => 'required|string|max:500',
                'buyer.ip' => 'required|ip',
                'buyer.city' => 'required|string|max:255',
                'buyer.country' => 'required|string|max:255',
                'buyer.zipCode' => 'required|string|max:20',

                // Shipping Address Rules
                'shippingAddress' => 'required|array',
                'shippingAddress.contactName' => 'required|string|max:255',
                'shippingAddress.city' => 'required|string|max:255',
                'shippingAddress.country' => 'required|string|max:255',
                'shippingAddress.address' => 'required|string|max:500',
                'shippingAddress.zipCode' => 'required|string|max:20',

                // Billing Address Rules
                'billingAddress' => 'required|array',
                'billingAddress.contactName' => 'required|string|max:255',
                'billingAddress.city' => 'required|string|max:255',
                'billingAddress.country' => 'required|string|max:255',
                'billingAddress.address' => 'required|string|max:500',
                'billingAddress.zipCode' => 'required|string|max:20',

                // Basket Items Rules
                'basketItems' => 'required|array|min:1|max:100',
                'basketItems.*.id' => 'required|string|max:255',
                'basketItems.*.name' => 'required|string|max:255',
                'basketItems.*.category1' => 'required|string|max:255',
                'basketItems.*.category2' => 'nullable|string|max:255',
                'basketItems.*.itemType' => 'required|string|in:PHYSICAL,VIRTUAL',
                'basketItems.*.price' => 'required|numeric|min:0.01|max:999999.99',
            ];

            // Payment Card and Installment Rules
            if ($this->header('Payment-Method') !== 'Apm' && $this->header('Payment-Method') !== 'CheckoutForm' && $this->header('Payment-Method') !== 'QuickPwi' && $this->header('Payment-Method') !== 'CardToken') {
                $rules['paymentCard']                = 'required|array';
                $rules['paymentCard.cardHolderName'] = 'required|string|max:255';
                $rules['paymentCard.cardNumber']     = 'required|string|digits_between:13,19';
                $rules['paymentCard.expireMonth']    = 'required|string|size:2';
                $rules['paymentCard.expireYear']     = 'required|string|size:4';
                $rules['paymentCard.cvc']            = 'required|string|size:3';
                $rules['paymentCard.registerCard']   = 'nullable|in:0,1';
                $rules['installment']                = 'nullable|integer|min:1';
            }

            // Return URL Rules
            if ($this->header('Payment-Method') !== 'CreditCard') {
                $rules['callbackUrl'] = 'required|url|max:2048';
            }

            // Installments Rules
            if ($this->header('Payment-Method') !== 'CardToken' && $this->header('Payment-Method') !== 'ThreeDSecure' && $this->header('Payment-Method') !== 'CreditCard') {
                $rules['enabledInstallments']   = 'nullable|array|max:12';
                $rules['enabledInstallments.*'] = 'integer|min:1|max:12';
            }

            return $rules;
        }

        public function messages(): array
        {
            return [
                // General Messages
                'locale.required' => 'Dil seçimi zorunludur.',
                'locale.in' => 'Geçerli dil seçenekleri: tr, en',
                'conversationId.required' => 'Konuşma ID\'si zorunludur.',
                'conversationId.max' => 'Konuşma ID\'si çok uzun.',
                'price.required' => 'Fiyat bilgisi zorunludur.',
                'price.numeric' => 'Fiyat sayısal bir değer olmalıdır.',
                'price.min' => 'Fiyat en az 0.01 olmalıdır.',
                'paidPrice.gte' => 'Ödenen fiyat, fiyattan küçük olamaz.',
                'currency.in' => 'Geçerli para birimleri: TRY, USD, EUR, GBP',
                'callbackUrl.url' => 'Geri dönüş URL\'si geçerli bir URL olmalıdır.',
                'callbackUrl.max' => 'Geri dönüş URL\'si çok uzun.',
                'enabledInstallments.max' => 'En fazla 12 taksit seçeneği olabilir.',
                'enabledInstallments.*.max' => 'Taksit sayısı en fazla 12 olabilir.',

                // Buyer Messages
                'buyer.required' => 'Alıcı bilgileri zorunludur.',
                'buyer.name.regex' => 'Alıcı adı geçerli karakterler içermelidir.',
                'buyer.surname.regex' => 'Alıcı soyadı geçerli karakterler içermelidir.',
                'buyer.email.email' => 'Geçerli bir e-posta adresi giriniz.',
                'buyer.identityNumber.digits' => 'Kimlik numarası tam 11 haneli olmalıdır.',
                'buyer.gsmNumber.regex' => 'Geçerli bir telefon numarası giriniz.',
                'buyer.lastLoginDate.before_or_equal' => 'Son giriş tarihi geçerli olmalıdır.',
                'buyer.registrationDate.before_or_equal' => 'Kayıt tarihi geçerli olmalıdır.',

                // Basket Messages
                'basketItems.required' => 'Sepet öğeleri zorunludur.',
                'basketItems.min' => 'En az bir sepet öğesi bulunmalıdır.',
                'basketItems.max' => 'En fazla 100 sepet öğesi olabilir.',
                'basketItems.*.price.min' => 'Ürün fiyatı en az 0.01 olmalıdır.',

                // Payment Card Messages
                'paymentCard.required' => 'Ödeme kartı bilgileri zorunludur.',
                'paymentCard.cardHolderName.required' => 'Kart sahibi adı zorunludur.',
                'paymentCard.cardNumber.digits_between' => 'Kart numarası 13-19 haneli olmalıdır.',
                'paymentCard.expireMonth.regex' => 'Geçerli bir ay giriniz (01-12).',
                'paymentCard.expireYear.regex' => 'Geçerli bir yıl giriniz (son iki hane).',
                'paymentCard.cvc.size' => 'CVC kodu 3 haneli olmalıdır.',
                'paymentCard.registerCard.in' => 'Kart kaydı seçeneği 0 veya 1 olmalıdır.',

                // Installment Messages
                'installment.required' => 'Taksit sayısı zorunludur.',
                'installment.integer' => 'Taksit sayısı tam sayı olmalıdır.',
                'installment.min' => 'Taksit sayısı en az 1 olmalıdır.',

                // Header Messages
                'Payment-Method.required' => "Header 'Payment-Method' zorunludur.",
                'Payment-Method.in' => 'Geçerli ödeme yöntemleri: CheckoutForm, Apm, CreditCard, CardToken, ThreeDSecure',
            ];
        }

        public function prepareForValidation(): void
        {
            $this->merge([
                "Payment-Method" => $this->headers->get("Payment-Method")
            ]);

            // Set default value for installment if not provided
            if (!$this->has('installment') || $this->input('installment') === null) {
                $this->merge(['installment' => 1]);
            }
        }
    }
