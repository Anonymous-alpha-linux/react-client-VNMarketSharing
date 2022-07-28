import { AxiosError, AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';
import { userAPIInstance } from '../../config';

export const getUserInfo = () => async (dispatch: Dispatch<Action>) => {
    dispatch({
        type: ActionTypes.GET_USER_INFO,
    });

    try {
        const { username, avatar } = (await userAPIInstance.getInfo()).data as {
            username: string;
            avatar: string;
        };
        dispatch({
            type: ActionTypes.GET_USER_INFO_SUCCESS,
            payload: {
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
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        ...axiosConfig,
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
