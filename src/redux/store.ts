import reducer from "./reducers";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { resetErrorMiddleware } from "./middlewares";
export const store = createStore(
   reducer,
   {},
   composeWithDevTools(applyMiddleware(resetErrorMiddleware, thunk))
);
