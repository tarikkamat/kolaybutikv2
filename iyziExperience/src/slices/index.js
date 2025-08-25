import {combineReducers} from "redux";
import LayoutReducer from "./layouts/reducer";
import CartReducer from "./cart/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Cart: CartReducer
});

export default rootReducer;