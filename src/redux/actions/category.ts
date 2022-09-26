import { GetCategoryResponseDTO, GetProductResponseDTO } from './../../models';
import { ActionTypes } from '../action-types';
export type CategoryAction =
    | GetCategoryListAction
    | GetCategoryListSuccessAction
    | GetCategoryListFailedAction
    | GetProductListByCategoryAction
    | GetProductListByCategorySuccessAction
    | GetProductListByCategoryFailedAction;

type GetCategoryListAction = {
    type: ActionTypes.GET_CATEGORY_LIST;
};

type GetCategoryListSuccessAction = {
    type: ActionTypes.GET_CATEGORY_LIST_SUCCESS;
    payload: {
        categoryList: GetCategoryResponseDTO[];
        amount: number;
    };
};

type GetCategoryListFailedAction = {
    type: ActionTypes.GET_CATEGORY_LIST_FAILED;
    payload: string;
};

type GetProductListByCategoryAction = {
    type: ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY;
};

type GetProductListByCategorySuccessAction = {
    type: ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY_SUCCESS;
    payload: {
        categoryId: number;
        productList: GetProductResponseDTO[];
        page?: number;
        take?: number;
        max: number;
    };
};

type GetProductListByCategoryFailedAction = {
    type: ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY_FAILED;
    payload: string;
};
