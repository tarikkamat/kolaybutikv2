import {combineReducers} from "redux";
import LayoutReducer from "../features/layout/model/reducer";
import CartReducer from "../features/cart/model/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Cart: CartReducer
});

export default rootReducer;