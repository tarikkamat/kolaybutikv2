/**
 * Sepet içerisindeki ürünlerin fiyatlarını toplayıp
 * toplam tutarı (string olarak) döndürür.
 *
 * @param {Array} cart
 * @returns {string} Subtotal değerini string olarak döndürür (örn: "120.00")
 */
export function calculateSubTotal(cart) {
    const subTotal = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    return subTotal.toFixed(2);
}

/**
 * Toplam ücreti hesaplamak için:
 * Subtotal + kargo ücreti + KDV tutarı
 *
 * @param {Array} cart
 * @param {number} shippingCharge Kargo ücreti
 * @param {number} taxRate Vergi oranı (0.2 gibi)
 * @returns {string} Toplam değerini string olarak döndürür (örn: "150.00")
 */
export function calculateTotal(cart, shippingCharge, taxRate) {
    const subTotal = parseFloat(calculateSubTotal(cart));
    const tax = subTotal * taxRate;
    return (subTotal + shippingCharge + tax).toFixed(2);
}