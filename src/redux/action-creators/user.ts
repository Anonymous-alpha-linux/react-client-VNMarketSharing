import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';
import { userAPIInstance } from '../../config';
import { UpdateUserInfoRequest } from '../../models';

export const getUserInfo = () => async (dispatch: Dispatch<Action>) => {
    dispatch({
        type: ActionTypes.GET_USER_INFO,
    });

    try {
        const { userId, username, avatar } = (await userAPIInstance.getInfo())
            .data as {
            userId: string;
            username: string;
            avatar: string;
        };
        dispatch({
            type: ActionTypes.GET_USER_INFO_SUCCESS,
            payload: {
                userId: userId,
                username: username,
                avatar: avatar,
            },
        });
    } catch (error: Error | AxiosError | any) {
        let result = error instanceof Error ? error.message : 'Failed';
        if (error instanceof AxiosError && error.response) {
            result = error.response.data as string;
        }
        dispatch({
            type: ActionTypes.GET_USER_INFO_ERROR,
            payload: result,
        });
    }
};

export const changeAvatar =
    (file: File, axiosConfig?: AxiosRequestConfig) =>
    async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CHANGE_AVATAR,
        });

        try {
            const { newAvatar } = (
                await userAPIInstance.changeAvatar(
                    { file: file },
                    {
                        ...axiosConfig,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
            ).data as {
                newAvatar: string;
            };
            dispatch({
                type: ActionTypes.CHANGE_AVATAR_SUCCESS,
                payload: {
                    image: newAvatar,
                },
            });
        } catch (error: Error | AxiosError | any) {
            if (error instanceof AxiosError) {
                dispatch({
                    type: ActionTypes.CHANGE_AVATAR_ERROR,
                    payload: 'Error',
                });
            }
            throw error;
        }
    };

export const updateUserInfo =
    (body: UpdateUserInfoRequest, axiosConfig?: AxiosRequestConfig) =>
    async (dispatch: Dispatch) => {
        dispatch({
            type: ActionTypes.UPDATE_USER_INFO,
        });
        try {
            const { organizationName } = (
                await userAPIInstance.updateInfo(body, axiosConfig)
            ).data as {
                organizationName: string;
                message: string;
            };

            dispatch({
                type: ActionTypes.UPDATE_USER_INFO_SUCCESS,
                payload: {
                    organizationName: organizationName,
                },
            });
        } catch (error: Error | AxiosError | any) {
            let errorResponse = 'Failed';
            if (error instanceof AxiosError) {
                const { data } = error.response as AxiosResponse;
                errorResponse = typeof data === 'string' ? data : errorResponse;
            }
            dispatch({
                type: ActionTypes.UPDATE_USER_INFO_ERROR,
                payload: errorResponse,
            });
        }
    };
