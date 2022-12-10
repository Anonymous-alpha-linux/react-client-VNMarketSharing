import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { productAPIInstance, AppLocalStorage } from '../../config';
import {
    PostProductRequestDTO,
    ProductFilter,
} from '../../models';
import { Action, ActionTypes } from '..';

export const getProductList = (
    filter: ProductFilter,
    config?: AxiosRequestConfig
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.GET_PRODUCT_LIST,
        });
        productAPIInstance
            .getProductList(
                {
                    page: filter.page,
                    take: filter.take,
                },
                config
            )
            .then(({ data }) => {
                const { productList, amount } = data;
                dispatch({
                    type: ActionTypes.GET_PRODUCT_LIST_SUCCESS,
                    payload: {
                        productList: productList,
                        max: amount,
                    },
                });
            }).catch(error =>{
                dispatch({
                    type: ActionTypes.GET_PRODUCT_LIST_FAILED,
                    payload: error,
                });
            });
    };
};

export const postNewProduct = (productRequest: PostProductRequestDTO, config?: {
    onSuccess?: () => void;
    onError?: (error: AxiosError) => void;
    onUploadProgress?: (e: ProgressEvent) => void;
    onDownloadProgress?: (e: ProgressEvent) => void;
}) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.POST_NEW_PRODUCT,
        });

        try {
            const { data }: AxiosResponse<string> =
                await productAPIInstance.createNewProduct(productRequest, {
                    withCredentials: true,
                    onUploadProgress: config?.onUploadProgress,
                    onDownloadProgress: config?.onDownloadProgress,
                });

            config?.onSuccess?.();

            dispatch({
                type: ActionTypes.POST_NEW_PRODUCT_SUCCESS,
                payload: data,
            });

            setTimeout(() => {
                AppLocalStorage.removePostProductForm();
            }, 3000);
        } catch (error: any | Error | AxiosError) {
            if (axios.isAxiosError(error)) {
                config?.onError?.(error as AxiosError);
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
