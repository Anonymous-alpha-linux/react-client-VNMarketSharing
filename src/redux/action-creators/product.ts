import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { productAPIInstance, apiAuthURL, AppLocalStorage } from '../../config';
import { PostProductRequestDTO } from '../../models';
import { Action, ActionTypes } from '..';

export const postNewProduct = (productRequest: PostProductRequestDTO) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.POST_NEW_PRODUCT,
        });

        try {
            const { data }: AxiosResponse<string> = (
                await productAPIInstance.createNewProduct(productRequest, {
                    withCredentials: true,
                })
            ).data;

            dispatch({
                type: ActionTypes.POST_NEW_PRODUCT_SUCCESS,
                payload: data,
            });

            setTimeout(() => {
                AppLocalStorage.removePostProductForm();
            }, 3000);
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response as AxiosResponse;
                if (errResponse.data) {
                    const {
                        serverMessage,
                    }: { message: string; serverMessage: string } =
                        errResponse.data;
                    dispatch({
                        type: ActionTypes.POST_NEW_PRODUCT_FAILED,
                        payload: serverMessage,
                    });
                }
            } else {
                dispatch({
                    type: ActionTypes.POST_NEW_PRODUCT_FAILED,
                    payload: error?.message,
                });
            }
        }
    };
};
