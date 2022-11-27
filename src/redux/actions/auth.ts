import { ActionTypes } from '..';

export type AuthAction =
    | ILoginAction
    | ILoginSuccessAction
    | ILoginErrorAction
    | IRegisterAction
    | IRegisterSuccessAction
    | IRegisterErrorAction
    | ILogoutAction
    | ILogoutSuccessAction
    | ILogoutErrorAction
    | IGetUserAction
    | IGetUserSuccessAction
    | IGetUserErrorAction
    | IConfirmAccountAction
    | IConfirmAccountSuccessAction
    | IConfirmAccountErrorAction
    | IRefreshTokenAction
    | IRefreshTokenSuccessAction
    | IRefreshTokenErrorAction
    | IResetError
    | ISendEmailToChangePasswordAction
    | ISendEmailToChangePasswordSuccessAction
    | ISendEmailToChangePasswordErrorAction
    | IChangePasswordAction
    | IChangePasswordSuccessAction
    | IChangePasswordErrorAction
    | IResetStatus;

// 1. Login Actions
export interface ILoginAction {
    type: ActionTypes.LOGIN;
}
export interface ILoginSuccessAction {
    type: ActionTypes.LOGIN_SUCCESS;
    payload: {
        email: string;
        role: string;
        isAuthorized: boolean;
    };
}
export interface ILoginErrorAction {
    type: ActionTypes.LOGIN_FAILED;
    payload: string;
}

// 2. Register Actions
export interface IRegisterAction {
    type: ActionTypes.REGISTER;
}
export interface IRegisterSuccessAction {
    type: ActionTypes.REGISTER_SUCCESS;
}
export interface IRegisterErrorAction {
    type: ActionTypes.REGISTER_FAILED;
    payload: string;
}

// 3. Confirm Account Actions
export interface IConfirmAccountAction {
    type: ActionTypes.CONFIRM_ACCOUNT;
}
export interface IConfirmAccountSuccessAction {
    type: ActionTypes.CONFIRM_ACCOUNT_SUCCESS;
    payload: {
        email: string;
        role: string;
        isAuthorized: boolean;
    };
}
export interface IConfirmAccountErrorAction {
    type: ActionTypes.CONFIRM_ACCOUNT_FAILED;
    payload: string;
}

// 4. Get User Actions
export interface IGetUserAction {
    type: ActionTypes.GET_USER;
}
export interface IGetUserSuccessAction {
    type: ActionTypes.GET_USER_SUCCESS;
    payload: {
        email: string;
        role: string;
        roles: string[];
        isAuthorized: boolean;
    };
}
export interface IGetUserErrorAction {
    type: ActionTypes.GET_USER_FAILED;
    payload: string;
}

// 5. Logout Actions
export interface ILogoutAction {
    type: ActionTypes.LOGOUT;
}
export interface ILogoutSuccessAction {
    type: ActionTypes.LOGOUT_SUCCESS;
    payload: string;
}
export interface ILogoutErrorAction {
    type: ActionTypes.LOGOUT_FAILED;
    payload: string;
}

// 6. RefreshToken Actions
export interface IRefreshTokenAction {
    type: ActionTypes.REFRESH_JWT_TOKEN;
}
export interface IRefreshTokenSuccessAction {
    type: ActionTypes.REFRESH_JWT_TOKEN_SUCCESS;
}
export interface IRefreshTokenErrorAction {
    type: ActionTypes.REFRESH_JWT_TOKEN_FAILED;
    payload: string;
}

// 7. Persistances
export interface IResetError {
    type: ActionTypes.RESET_ERROR;
}

// 8. Send email to Change password
export interface ISendEmailToChangePasswordAction {
    type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD;
}
export interface ISendEmailToChangePasswordSuccessAction {
    type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_SUCCESS;
}
export interface ISendEmailToChangePasswordErrorAction {
    type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR;
    payload: string;
}

// 9. Change password
export interface IChangePasswordAction {
    type: ActionTypes.CHANGE_PASSWORD;
}
export interface IChangePasswordSuccessAction {
    type: ActionTypes.CHANGE_PASSWORD_SUCCESS;
}
export interface IChangePasswordErrorAction {
    type: ActionTypes.CHANGE_PASSWORD_ERROR;
    payload: string;
}

// 9. Unmount component
export interface IResetStatus {
    type: ActionTypes.RESET_STATUS;
}
