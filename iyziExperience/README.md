## FormData Örneği

```javascript
const [formData, setFormData] = useState({
    conversationId: "conversationId",
    locale: "tr",
    name: "Lorem ipsum",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
});
```

## Response Örneği

```javascript
const [response, setResponse] = useState({
    "status": "success",
    "systemTime": 1686785492734,
    "data": {
        "referenceCode": "ac3afdd2-69af-4ca6-a284-46bf8540a954",
        "createdDate": 1686785492730,
        "name": "",
        "description": "",
        "status": "ACTIVE",
        "pricingPlans": []
    }
})
```

## FormData ile Response Uyumlu Hale Getirme

* Bu kısımda formData'daki name ve description değerlerini response'un data kısmındaki name ve description değerlerine atıyoruz.
* Bu sayede response'un name ve description değerleri formData'daki name ve description değerlerine eşit olmuş oluyor.

```javascript
useEffect(() => {
    setResponse(prevResponse => ({
        ...prevResponse,
        data: {
            ...prevResponse.data,
            name: formData.name,
            description: formData.description
        }
    }))
}, [formData.name, formData.description])
```

## Yeni Modal Nasıl Eklenmeli

Örneğin: Subscriptions sayfasına yeni bir modal eklemek istiyoruz. Bunun için aşağıdaki adımları takip edebiliriz.

``src/pages/Subscription/Modals``

klasörüne gidilir ve yeni bir dosya oluşturulur. Örneğin: ``CreateProductModal.js``

Daha sonra ``src/pages/Subscription/ProductSettingsModalList.js`` dosyasına gidilir ve aşağıdaki gibi yeni modal eklenir.

```javascript
<CreateProductModal
    isOpen={activeModal === 'createProduct'}
    toggle={() => toggleModal('createProduct')}
/>
```

Buradaki createProduct gibi anahtar kelimeler ``src/pages/Subscription/CheckoutYedek.js`` dosyasında tanımlanmış olmalıdır.

```javascript
<DropdownMenu>
    <DropdownItem onClick={() => openModal('createProduct')}>Ürün Oluşturma</DropdownItem>
    <DropdownItem>Ürün Güncelleme</DropdownItem>
    <DropdownItem>Ürün Silme</DropdownItem>
    <DropdownItem>Ürün Detay</DropdownItem>
    <DropdownItem>Ürün Listeleme</DropdownItem>
</DropdownMenu>
```