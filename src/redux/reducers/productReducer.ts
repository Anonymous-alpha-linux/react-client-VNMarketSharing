import { ReducerState } from '.';
import {
    GetCategoryResponseDTO,
    GetProductResponseDTO,
    ResponseStatus,
} from '../../models';
import { ActionTypes, Action } from '..';

type ProductState = {
    productList: GetProductResponseDTO[];
    categoryList: GetCategoryResponseDTO[];
    page: number;
    take: number;
    relatedCategory?: string;
    max?: number;
};

const initialState: ReducerState<ProductState> = {
    data: {
        productList: [],
        page: 1,
        take: 5,
        categoryList: [],
    },
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

const productReducer = (
    state: ReducerState<ProductState> = initialState,
    action: Action
): ReducerState<ProductState> => {
    const oldProductList = state.data.productList;
    switch (action.type) {
        case ActionTypes.GET_PRODUCT_LIST:
            return {
                ...state,
                loading: true,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_PRODUCT_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: {
                    ...state.data,
                    productList: [
                        ...oldProductList,
                        ...action.payload.productList,
                    ],
                    page: state.data.page + 1,
                    max: action.payload.max,
                },
                error: '',
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.GET_PRODUCT_LIST_FAILED:
            return {
                ...state,
                data: {
                    ...state.data,
                    page: state.data.page,
                },
                loading: false,
                error: action.payload,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.UPDATE_NEW_PRODUCT:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.UPDATE_NEW_PRODUCT_SUCCESS:
            return {
                loading: false,
                error: '',
                data: state.data,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.UPDATE_NEW_PRODUCT_FAILED:
            return {
                loading: false,
                error: '',
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.POST_NEW_PRODUCT:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.POST_NEW_PRODUCT_SUCCESS:
            return {
                loading: false,
                error: '',
                data: state.data,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.POST_NEW_PRODUCT_FAILED:
            return {
                loading: false,
                error: '',
                data: state.data,
                status: ResponseStatus.FAILED,
            };
        
            default:
            return state;
    }
};

export default productReducer;
