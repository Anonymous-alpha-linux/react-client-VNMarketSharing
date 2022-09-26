import { GetProductResponseDTO } from '../../models';
import { ActionTypes } from '../action-types';

export type ProductAction =
    | GetProductList
    | GetProductListSuccess
    | GetProductListFailed
    | PostNewProduct
    | PostNewProductSuccess
    | PostNewProductFailed
    | UpdateProduct
    | UpdateProductSuccess
    | UpdateProductFailed;

type GetProductList = {
    type: ActionTypes.GET_PRODUCT_LIST;
};

type GetProductListSuccess = {
    type: ActionTypes.GET_PRODUCT_LIST_SUCCESS;
    payload: {
        productList: GetProductResponseDTO[];
        max: number;
    };
};

type GetProductListFailed = {
    type: ActionTypes.GET_PRODUCT_LIST_FAILED;
    payload: string;
};

type PostNewProduct = {
    type: ActionTypes.POST_NEW_PRODUCT;
};

type PostNewProductSuccess = {
    type: ActionTypes.POST_NEW_PRODUCT_SUCCESS;
    payload: string;
};

type PostNewProductFailed = {
    type: ActionTypes.POST_NEW_PRODUCT_FAILED;
    payload: string;
};

type UpdateProduct = {
    type: ActionTypes.UPDATE_NEW_PRODUCT;
};

type UpdateProductSuccess = {
    type: ActionTypes.UPDATE_NEW_PRODUCT_SUCCESS;
    payload: string;
};

type UpdateProductFailed = {
    type: ActionTypes.UPDATE_NEW_PRODUCT_FAILED;
    payload: string;
};
