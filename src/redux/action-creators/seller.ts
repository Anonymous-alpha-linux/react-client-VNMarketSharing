import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { sellerAPIInstance } from '../../config';
import { GetUserPageResponseDTO, PostUserPageRequestDTO } from '../../models';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

export const getSellerInfo = (userId: number, config?: AxiosRequestConfig) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.GET_USER_PAGE,
        });

        try {
            const { data }: AxiosResponse<GetUserPageResponseDTO> =
                await sellerAPIInstance.getSellerPage(userId, config);

            dispatch({
                type: ActionTypes.GET_USER_PAGE_SUCCESS,
                payload: data,
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
                        type: ActionTypes.GET_USER_PAGE_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.GET_USER_PAGE_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const postSellerInfo = (
    userId: number,
    request: PostUserPageRequestDTO,
    config?: AxiosRequestConfig
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CREATE_UPDATE_USER_PAGE,
        });

        try {
            const { data }: AxiosResponse<GetUserPageResponseDTO> =
                await sellerAPIInstance.postSellerPage(userId, request, config);

            dispatch({
                type: ActionTypes.CREATE_UPDATE_USER_PAGE_SUCCESS,
                payload: data,
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
                        type: ActionTypes.CREATE_UPDATE_USER_PAGE_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.CREATE_UPDATE_USER_PAGE_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const changeSellerAvatar = (
    userId: number,
    newAvatar: File,
    config?: AxiosRequestConfig
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CHANGE_USER_PAGE_AVATAR,
        });

        try {
            const { data }: AxiosResponse<string> =
                await sellerAPIInstance.changeSellerAvatar(
                    userId,
                    newAvatar,
                    config
                );

            dispatch({
                type: ActionTypes.CHANGE_USER_PAGE_AVATAR_SUCCESS,
                payload: data,
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
                        type: ActionTypes.CHANGE_USER_PAGE_AVATAR_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.CHANGE_USER_PAGE_AVATAR_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};

export const changeSellerBanner = (
    userId: number,
    newBanner: File,
    config?: AxiosRequestConfig
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CHANGE_USER_PAGE_BANNER,
        });

        try {
            const { data }: AxiosResponse<string> =
                await sellerAPIInstance.changeSellerBanner(
                    userId,
                    newBanner,
                    config
                );

            dispatch({
                type: ActionTypes.CHANGE_USER_PAGE_BANNER_SUCCESS,
                payload: data,
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
                        type: ActionTypes.CHANGE_USER_PAGE_BANNER_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.CHANGE_USER_PAGE_BANNER_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};
