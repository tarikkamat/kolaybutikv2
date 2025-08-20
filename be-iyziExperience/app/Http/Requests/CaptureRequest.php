<?php

    namespace App\Http\Requests;

    use Illuminate\Foundation\Http\FormRequest;

    class CaptureRequest extends FormRequest
    {
        public function authorize(): bool
        {
            return true;
        }

        public function rules(): array
        {
            $rules = [
                // Header Rules
                'Payment-Method' => 'required|string|in:ThreeDSecure',

                // General Rules
                'locale' => 'required|string|in:tr,en',
                'conversationId' => 'required|string|max:255',
            ];

            // Direct Payment Rules
            if ($this->header('Payment-Method') === 'ThreeDSecure') {
                $rules['paymentId']   = 'required|string|max:255';
                $rules['paymentConversationId'] = 'required|string|max:255';
                $rules['conversationData'] = 'required|string|max:255';
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

                // Direct Payment Messages
                'paymentId.required' => 'Ödeme ID\'si zorunludur.',
                'paymentId.max' => 'Ödeme ID\'si çok uzun.',
                'paymentConversationId.required' => 'Ödeme konuşma ID\'si zorunludur.',
                'paymentConversationId.max' => 'Ödeme konuşma ID\'si çok uzun.',
                'conversationData.required' => 'Konuşma verisi zorunludur.',
                'conversationData.max' => 'Konuşma verisi çok uzun.',

                // Header Messages
                'Payment-Method.required' => "Header 'Payment-Method' zorunludur.",
                'Payment-Method.in' => 'Geçerli ödeme yöntemleri: ThreeDSecure',
            ];
        }

        public function prepareForValidation(): void
        {
            $this->merge([
                "Payment-Method" => $this->headers->get("Payment-Method")
            ]);
        }
    }
