import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import {
    axiosAuthAPIInstance,
    apiAuthURL,
    AppLocalStorage,
} from '../../config';
import {
    Response,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    GetUserResponse,
    ChangePasswordRequest,
} from '../../models';
import { Action, ActionTypes } from '..';

export const login = (loginRequest: LoginRequest) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.LOGIN,
        });

        try {
            const { data }: Response<LoginResponse> = (
                await axiosAuthAPIInstance.post(
                    apiAuthURL.login,
                    loginRequest,
                    {
                        withCredentials: true,
                        params: {
                            returnURL: loginRequest.returnURL,
                        },
                    }
                )
            ).data;
            AppLocalStorage.setLoginUser(data.accessToken);
            dispatch({
                type: ActionTypes.LOGIN_SUCCESS,
                payload: {
                    email: data.email,
                    role: data.roles[0].roleName,
                    isAuthorized: true,
                },
            });
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response as AxiosResponse;
                if (errResponse.data) {
                    const {
                        serverMessage,
                    }: { message: string; serverMessage: string } =
                        errResponse.data;
                    dispatch({
                        type: ActionTypes.LOGIN_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.LOGIN_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const register = (
    registerRequest: RegisterRequest,
    returnURL: string
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.REGISTER,
        });

        try {
            const { message }: Response<RegisterResponse> = (
                await axiosAuthAPIInstance.post(
                    apiAuthURL.register,
                    registerRequest,
                    {
                        params: {
                            returnUrl: encodeURIComponent(returnURL),
                        },
                    }
                )
            ).data;

            dispatch({
                type: ActionTypes.REGISTER_SUCCESS,
                payload: message,
            });
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                const errorResponse = error.response as AxiosResponse;
                if (errorResponse.data) {
                    const { serverMessage }: Response<RegisterResponse> =
                        errorResponse.data;
                    dispatch({
                        type: ActionTypes.REGISTER_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.REGISTER_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const logout = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.LOGOUT,
        });

        try {
            const { message }: Response<null> = (
                await axiosAuthAPIInstance.get(apiAuthURL.logout)
            ).data;
            AppLocalStorage.removeLoginUser();
            dispatch({
                type: ActionTypes.LOGOUT_SUCCESS,
                payload: message,
            });
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                dispatch({
                    type: ActionTypes.LOGOUT_FAILED,
                    payload: error.message,
                });
            } else {
                dispatch({
                    type: ActionTypes.LOGOUT_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const getUser = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.GET_USER,
        });

        try {
            const { data }: Response<GetUserResponse> = (
                await axiosAuthAPIInstance.get(apiAuthURL.getUser)
            ).data;
            dispatch({
                type: ActionTypes.GET_USER_SUCCESS,
                payload: {
                    email: data.email,
                    role: data.roles[0].roleName,
                    isAuthorized: true,
                },
            });
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                dispatch({
                    type: ActionTypes.GET_USER_FAILED,
                    payload: error.message,
                });
            } else {
                dispatch({
                    type: ActionTypes.GET_USER_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const refreshToken = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.REFRESH_JWT_TOKEN,
        });

        try {
            await axiosAuthAPIInstance.get(apiAuthURL.confirmEmail);

            dispatch({
                type: ActionTypes.REFRESH_JWT_TOKEN_SUCCESS,
            });
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                dispatch({
                    type: ActionTypes.REFRESH_JWT_TOKEN_FAILED,
                    payload: error.message,
                });
            } else {
                dispatch({
                    type: ActionTypes.REFRESH_JWT_TOKEN_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const confirmEmail = (userId: string, token: string) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CONFIRM_ACCOUNT,
        });

        try {
            const { data }: Response<LoginResponse> = (
                await axiosAuthAPIInstance.get(apiAuthURL.confirmEmail, {
                    params: {
                        userId,
                        token,
                    },
                })
            ).data;
            AppLocalStorage.setLoginUser(data.accessToken);
            dispatch({
                type: ActionTypes.CONFIRM_ACCOUNT_SUCCESS,
                payload: {
                    email: data.email,
                    role: data.roles[0].roleName,
                    isAuthorized: true,
                },
            });
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                dispatch({
                    type: ActionTypes.CONFIRM_ACCOUNT_FAILED,
                    payload: error.message,
                });
            } else {
                dispatch({
                    type: ActionTypes.CONFIRM_ACCOUNT_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const resetError = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.RESET_ERROR,
        });
    };
};

export const resetStatus = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.RESET_STATUS,
        });
    };
};

export const sendEmailToChangePassword = (email: string) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD,
        });
        try {
            await axiosAuthAPIInstance.post(
                apiAuthURL.sendEmailtoChangePassword,
                null,
                {
                    params: {
                        email: email,
                        return: '/',
                    },
                }
            );

            dispatch({
                type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_SUCCESS,
            });
        } catch (error: any | AxiosError | Error) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response as AxiosResponse;
                if (errResponse) {
                    const {
                        serverMessage,
                    }: { message: string; serverMessage: string } =
                        errResponse.data;
                    dispatch({
                        type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
                        payload: serverMessage,
                    });
                } else {
                    dispatch({
                        type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
                        payload: 'Send email request failed',
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
                    payload: error.message,
                });
            }
        }
    };
};

export const changePassword = (request: ChangePasswordRequest) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CHANGE_PASSWORD,
        });
        try {
            await axiosAuthAPIInstance.post(apiAuthURL.changePassword, request);

            dispatch({
                type: ActionTypes.CHANGE_PASSWORD_SUCCESS,
            });
        } catch (error: any | AxiosError | Error) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response as AxiosResponse;
                if (errResponse.data) {
                    const {
                        serverMessage,
                    }: { message: string; serverMessage: string } =
                        errResponse.data;
                    dispatch({
                        type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
                        payload: serverMessage,
                    });
                } else
                    dispatch({
                        type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
                        payload: 'Error client',
                    });
            } else {
                dispatch({
                    type: ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
                    payload: error.message,
                });
            }
        }
    };
};

export * from './user';
