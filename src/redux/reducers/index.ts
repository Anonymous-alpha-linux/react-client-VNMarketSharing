import { combineReducers } from 'redux';
import authReducer from './authReducer';
import chatReducer from './chatReducer';
import userReducer from './userReducer';
import productReducer from './productReducer';
import { ResponseStatus } from '../../models';
import { sellerReducer } from './sellerReducer';
import { cartReducer } from './cartReducer';
import categoryReducer from './categoryReducer';

const reducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
    product: productReducer,
    seller: sellerReducer,
    cart: cartReducer,
    category: categoryReducer,
});

export type ReducerState<T> = {
    data: T;
    loading: boolean;
    error: string;
    status?: ResponseStatus;
};

export default reducer;
export type StoreState = ReturnType<typeof reducer>;
