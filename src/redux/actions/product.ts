import { GetProductResponseDTO, ReviewProductResponseDTO } from '../../models';
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
    | UpdateProductFailed
    | GetReviewProductListAction
    | GetReviewProductListSuccessAction
    | GetReviewProductListFailedAction
    | CreateReviewProductAction
    | CreateReviewProductSuccessAction
    | CreateReviewProductFailedAction
    | UpdateReviewProductAction
    | UpdateReviewProductSuccessAction
    | UpdateReviewProductFailedAction;

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

type GetReviewProductListAction = {
    type: ActionTypes.GET_REVIEW_LIST;
};

type GetReviewProductListSuccessAction = {
    type: ActionTypes.GET_REVIEW_LIST_SUCCESS;
    payload: {
        reviewList: ReviewProductResponseDTO[];
        reviewAmount: number;
        productId: number;
    };
};

type GetReviewProductListFailedAction = {
    type: ActionTypes.GET_REVIEW_LIST_FAILED;
    payload: string;
};

type CreateReviewProductAction = {
    type: ActionTypes.CREATE_NEW_REVIEW;
};

type CreateReviewProductSuccessAction = {
    type: ActionTypes.CREATE_NEW_REVIEW_SUCCESS;
    payload: {
        newReview: ReviewProductResponseDTO;
        productId: number;
    };
};

type CreateReviewProductFailedAction = {
    type: ActionTypes.CREATE_NEW_REVIEW_FAILED;
    payload: string;
};

type UpdateReviewProductAction = {
    type: ActionTypes.UPDATE_REVIEW;
};

type UpdateReviewProductSuccessAction = {
    type: ActionTypes.UPDATE_REVIEW_SUCCESS;
    payload: {
        newReview: ReviewProductResponseDTO;
        productId: number;
    };
};

type UpdateReviewProductFailedAction = {
    type: ActionTypes.UPDATE_REVIEW_FAILED;
    payload: string;
};
