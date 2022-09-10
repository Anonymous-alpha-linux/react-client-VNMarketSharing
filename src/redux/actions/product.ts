import { ActionTypes } from '../action-types';

export type ProductAction =
    | PostNewProduct
    | PostNewProductSuccess
    | PostNewProductFailed
    | UpdateProduct
    | UpdateProductSuccess
    | UpdateProductFailed;

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
