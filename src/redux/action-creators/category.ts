import { Dispatch } from 'react';
import { AxiosRequestConfig } from 'axios';
import { GetCategoryResponseDTO, ProductFilter } from '../../models';
import { categoryAPIInstance, productAPIInstance } from '../../config';
import { ActionTypes, Action } from '..';
import { axiosErrorHandler } from '../../hooks';

export const getCategoryList = (config?: AxiosRequestConfig) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.GET_CATEGORY_LIST,
        });

        axiosErrorHandler(
            () => {
                categoryAPIInstance
                    .getAllCategories(config)
                    .then(({ data }) => {
                        dispatch({
                            type: ActionTypes.GET_CATEGORY_LIST_SUCCESS,
                            payload: {
                                categoryList: data,
                                amount: data.length,
                            },
                        });
                    });
            },
            (error) => {
                dispatch({
                    type: ActionTypes.GET_PRODUCT_LIST_FAILED,
                    payload: error,
                });
            }
        );
    };
};

export const getProductByCategory = (
    categoryId: number,
    filter: ProductFilter,
    config?: AxiosRequestConfig
) => {
    return async (dispatch: Dispatch<Action>) => {
        axiosErrorHandler(
            () => {
                dispatch({
                    type: ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY,
                });

                productAPIInstance
                    .getProductList(filter, config)
                    .then(({ data }) => {
                        const { productList, amount } = data;

                        dispatch({
                            type: ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY_SUCCESS,
                            payload: {
                                categoryId: categoryId,
                                productList: productList,
                                max: amount,
                                page: filter.page,
                                take: filter.take,
                            },
                        });
                    });
            },
            (error) => {
                dispatch({
                    type: ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY_FAILED,
                    payload: error,
                });
            }
        );
    };
};
