import { Dispatch } from "redux";
import React from "react";
import { StoreState } from "../reducers";
import { Action } from "../actions";
import { resetError } from "../action-creators";
import { ActionTypes } from "../action-types";

export const resetErrorMiddleware = ({
   dispatch,
   getState,
}: {
   dispatch: Dispatch<Action>;
   getState: () => StoreState;
}) => {
   return (next: (action: Action) => void) => {
      return (action: Action) => {
         next(action);

         let timer: any;
         const { auth } = getState();
         const exceptionActionTypes = [
            ActionTypes.CONFIRM_ACCOUNT_FAILED,
            ActionTypes.GET_USER_FAILED,
            ActionTypes.LOGIN_FAILED,
            ActionTypes.LOGOUT_FAILED,
            ActionTypes.REGISTER_FAILED,
         ];
         if (auth.error || exceptionActionTypes.includes(action.type)) {
            if (timer) {
               clearTimeout(timer);
            }
            timer = setTimeout(() => {
               resetError()(dispatch);
            }, 3000);
         }
      };
   };
};
