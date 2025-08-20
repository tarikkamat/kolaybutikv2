<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Secure Doğrulama</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 90%;
            text-align: center;
        }
        .header {
            margin-bottom: 2rem;
        }
        .header img {
            max-width: 150px;
            margin-bottom: 1rem;
        }
        .title {
            color: #2c3e50;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        .subtitle {
            color: #7f8c8d;
            font-size: 1rem;
            margin-bottom: 2rem;
        }
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 2rem 0;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        .message {
            color: #34495e;
            font-size: 0.9rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .footer {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: #95a5a6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.iyzico.com/assets/images/content/logo.svg?v=v4.0.588" alt="iyzico Logo">
            <h1 class="title">3D Secure Doğrulama</h1>
            <p class="subtitle">Lütfen işleminizi tamamlamak için bekleyiniz...</p>
        </div>

        <div class="loading">
            <div class="spinner"></div>
            <p class="message">Güvenli ödeme sayfasına yönlendiriliyorsunuz...</p>
        </div>

        <div class="footer">
            <p>Bu işlem güvenli bir şekilde iyzico altyapısı kullanılarak gerçekleştirilmektedir.</p>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const htmlContent = @json($ThreeDSecurePaymentHtmlContent);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            const form = tempDiv.querySelector('form');
            if (form) {
                document.body.appendChild(form);
                setTimeout(() => {
                    form.submit();
                }, 4000);
            }
        });
    </script>
</body>
</html>
