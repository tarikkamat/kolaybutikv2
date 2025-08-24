import {createSlice} from "@reduxjs/toolkit"

export const initialState = {
    cart: [],
    cartItemCount: 0,
}

const CartSlice = createSlice({
    name: 'CartSlice',
    initialState,
    reducers: {
        addToCartAction(state, action) {
            const {product, quantity} = action.payload
            const existingProduct = state.cart.find(item => item.id === product.id)

            state.cartItemCount += quantity

            if (existingProduct) {
                existingProduct.quantity += quantity
            } else {
                state.cart.push({...product, quantity})
            }
        },
        removeFromCartAction(state, action) {
            const {product, quantity} = action.payload
            const existingProduct = state.cart.find(item => item.id === product.id)

            state.cartItemCount -= quantity

            if (existingProduct.quantity === quantity) {
                state.cart = state.cart.filter(item => item.id !== product.id)
            } else {
                existingProduct.quantity -= quantity
            }
        },
        clearCartAction(state) {
            state.cart = []
            state.cartItemCount = 0
        }
    }
})

export const {
    addToCartAction,
    removeFromCartAction,
    clearCartAction
} = CartSlice.actions

export default CartSlice.reducer
