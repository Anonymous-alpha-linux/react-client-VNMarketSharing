import { combineReducers } from 'redux';
import authReducer from './authReducer';
import chatReducer from './chatReducer';
import userReducer from './userReducer';

const reducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
});

export default reducer;
export type StoreState = ReturnType<typeof reducer>;
