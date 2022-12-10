import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';
import { userAPIInstance } from '../../config';
import { UpdateUserInfoRequest, GetNotificationDTO, GetNotificationTrackerDTO } from '../../models';

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
    (file: File, axiosConfig?: AxiosRequestConfig & {
        onSuccess: () => void,
        onError: (error: AxiosError) => void
    }) =>
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
            axiosConfig?.onSuccess?.();
            dispatch({
                type: ActionTypes.CHANGE_AVATAR_SUCCESS,
                payload: {
                    image: newAvatar,
                },
            });
        } catch (error: Error | AxiosError | any) {
            if (error instanceof AxiosError) {
                axiosConfig?.onError?.(error);
                dispatch({
                    type: ActionTypes.CHANGE_AVATAR_ERROR,
                    payload: 'Error',
                });
            }
            throw error;
        }
    };

export const loadingChangeAvatar = () =>{
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CHANGE_AVATAR,
        });
    }
}

export const updateUserInfo =
    (body: UpdateUserInfoRequest, axiosConfig?: AxiosRequestConfig & {
        onSuccess: () => void,
        onError: (error: AxiosError) => void
    }) =>
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
            axiosConfig?.onSuccess?.();
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
                axiosConfig?.onError?.(error);
            }
            dispatch({
                type: ActionTypes.UPDATE_USER_INFO_ERROR,
                payload: errorResponse,
            });
        }
    };

export const getNotifications = (userId: number,filter?: {
    page: number;
    take: number;
}, config?: AxiosRequestConfig & {
    onSuccess?: () => void;
    onFailed?: (error: string) => void;
}) => {
    return async (dispatch: Dispatch) =>{
        dispatch({
            type: ActionTypes.GET_NOTIFICATIONS
        });

        userAPIInstance.getNotifications(userId, filter, config)
            .then(response =>{
                if(response.data.hasOwnProperty("result") && response.data.hasOwnProperty("max") && response.data.hasOwnProperty("amount")){
                    const {result, max, amount} = response.data;
                    console.log(response.data);
                    config?.onSuccess?.();
                    dispatch({
                        type: ActionTypes.GET_NOTIFICATIONS_SUCCESS,
                        payload: result
                    });
                }
            }).catch(error => {
                let errorMsg = error.message;
                if(error instanceof AxiosError){
                    errorMsg = "Failed on request";
                    dispatch({
                        type: ActionTypes.GET_NOTIFICATIONS_FAILED,
                        payload: error.message
                    });
                }
                config?.onFailed?.(errorMsg);
            });
    }
}

export const pushNewNotification = (newNotification: GetNotificationTrackerDTO) => {
    return async (dispatch: Dispatch) =>{
        dispatch({
            type: ActionTypes.PUSH_NEW_NOTIFICATION
        });

        try {
            dispatch({
                type: ActionTypes.PUSH_NEW_NOTIFICATION_SUCCESS,
                payload: newNotification
            });
        } catch (error: Error | any) {
            dispatch({
                type: ActionTypes.PUSH_NEW_NOTIFICATION_FAILED,
                payload: error.message
            });
        }
    }
}