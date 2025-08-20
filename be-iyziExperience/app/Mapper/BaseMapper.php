<?php

    namespace App\Mapper;

    use App\Http\Requests\InitializeRequest;
    use Iyzipay\Model\Address;
    use Iyzipay\Model\BasketItem;
    use Iyzipay\Model\Buyer;
    use Iyzipay\Model\PaymentCard;
    use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
    use Iyzipay\Request\CreatePaymentRequest;
    use Iyzipay\Request\CreatePayWithIyzicoInitializeRequest;

    abstract readonly class BaseMapper
    {
        private function generateBuyer(array $buyerData): Buyer
        {
            $buyer = new Buyer();

            $buyer->setId($buyerData['id']);
            $buyer->setName($buyerData['name']);
            $buyer->setSurname($buyerData['surname']);
            $buyer->setGsmNumber($buyerData['gsmNumber']);
            $buyer->setEmail($buyerData['email']);
            $buyer->setIdentityNumber($buyerData['identityNumber']);
            $buyer->setLastLoginDate($buyerData['lastLoginDate'] ?? null);
            $buyer->setRegistrationDate($buyerData['registrationDate'] ?? null);
            $buyer->setRegistrationAddress($buyerData['registrationAddress']);
            $buyer->setIp($buyerData['ip']);
            $buyer->setCity($buyerData['city']);
            $buyer->setCountry($buyerData['country']);
            $buyer->setZipCode($buyerData['zipCode']);

            return $buyer;
        }

        private function generateAddress(array $addressData): Address
        {
            $address = new Address();

            $address->setContactName($addressData['contactName']);
            $address->setCity($addressData['city']);
            $address->setCountry($addressData['country']);
            $address->setAddress($addressData['address']);
            $address->setZipCode($addressData['zipCode']);

            return $address;
        }

        private function generateBasketItems(array $basketItemsData): array
        {
            $basketItems = array();

            foreach ($basketItemsData as $itemData) {
                $basketItem = new BasketItem();
                $basketItem->setId($itemData['id']);
                $basketItem->setName($itemData['name']);
                $basketItem->setCategory1($itemData['category1']);
                $basketItem->setCategory2($itemData['category2'] ?? null);
                $basketItem->setItemType($itemData['itemType']);
                $basketItem->setPrice($itemData['price']);
                $basketItems[] = $basketItem;
            }

            return $basketItems;
        }

        protected function setBasicPaymentInformation(
            CreatePayWithIyzicoInitializeRequest|CreateCheckoutFormInitializeRequest|CreatePaymentRequest $request,
            InitializeRequest $initializeRequest
        ): void {
            $request->setLocale($initializeRequest->input('locale'));
            $request->setConversationId($initializeRequest->input('conversationId'));
            $request->setPrice($initializeRequest->input('price'));
            $request->setPaidPrice($initializeRequest->input('paidPrice'));
            $request->setCurrency($initializeRequest->input('currency'));
            $request->setBasketId($initializeRequest->input('basketId'));
            $request->setPaymentGroup($initializeRequest->input('paymentGroup'));
            $request->setCallbackUrl($initializeRequest->input('callbackUrl'));
        }

        protected function setCommonRequestData(
            CreatePayWithIyzicoInitializeRequest|CreateCheckoutFormInitializeRequest|CreatePaymentRequest $request,
            InitializeRequest $initializeRequest
        ): void {
            // Enabled installments
            if ($initializeRequest->has('enabledInstallments')) {
                $request->setEnabledInstallments($initializeRequest->input('enabledInstallments'));
            }

            // Buyer information
            $request->setBuyer($this->generateBuyer($initializeRequest->input('buyer')));

            // Shipping address
            $request->setShippingAddress($this->generateAddress($initializeRequest->input('shippingAddress')));

            // Billing address
            $request->setBillingAddress($this->generateAddress($initializeRequest->input('billingAddress')));

            // Basket items
            $request->setBasketItems($this->generateBasketItems($initializeRequest->input('basketItems')));
        }

        protected function setCreditCardInformation(
            CreatePaymentRequest $request,
            InitializeRequest $initializeRequest
        ): void {
            if($initializeRequest->has('paymentCard')) {
                $paymentCardModel = new PaymentCard();

                $paymentCardModel->setCardHolderName($initializeRequest->input('paymentCard.cardHolderName'));
                $paymentCardModel->setCardNumber($initializeRequest->input('paymentCard.cardNumber'));
                $paymentCardModel->setExpireMonth($initializeRequest->input('paymentCard.expireMonth'));
                $paymentCardModel->setExpireYear($initializeRequest->input('paymentCard.expireYear'));
                $paymentCardModel->setCvc($initializeRequest->input('paymentCard.cvc'));
                $paymentCardModel->setRegisterCard($initializeRequest->input('paymentCard.registerCard', 0));

                // Set the payment card information to the request
                $request->setPaymentCard($paymentCardModel);
            } else {
                throw new \InvalidArgumentException('Payment card information is required for credit card payments.');
            }
        }
    }
