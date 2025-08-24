import {addToCartAction, clearCartAction, removeFromCartAction} from "./reducer"

export const addToCart = (product) => async (dispatch) => {
    dispatch(addToCartAction(product))
}
export const removeFromCart = (product) => async (dispatch) => {
    dispatch(removeFromCartAction(product))
}
export const clearCart = () => async (dispatch) => {
    dispatch(clearCartAction())
}