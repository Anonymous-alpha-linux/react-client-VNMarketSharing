import { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { addressAPIInstance } from '../../config';
import { axiosErrorHandler } from '../../hooks';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

export const getAddressList = (userId: number, config?: AxiosRequestConfig) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.GET_ADDRESS_LIST,
        });

        if (userId) {
            axiosErrorHandler(
                () => {
                    Promise.all([
                        addressAPIInstance.getAddresses(
                            userId.toString(),
                            0,
                            config
                        ),
                        addressAPIInstance.getAddresses(
                            userId.toString(),
                            1,
                            config
                        ),
                    ]).then((response) => {
                        if (
                            Array.isArray(response[0].data) &&
                            Array.isArray(response[1].data)
                        ) {
                            dispatch({
                                type: ActionTypes.GET_ADDRESS_LIST_SUCCESS,
                                payload: [
                                    ...response[0].data,
                                    ...response[1].data,
                                ],
                            });
                        }
                    });
                },
                (msg) => {
                    dispatch({
                        type: ActionTypes.GET_ADDRESS_LIST_FAILED,
                        payload: msg,
                    });
                }
            );
        }
    };
};
