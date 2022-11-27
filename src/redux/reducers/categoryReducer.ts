import { ReducerState } from '.';
import {
    GetCategoryResponseDTO,
    GetProductResponseDTO,
    ResponseStatus,
} from '../../models';
import { ActionTypes, Action } from '..';

type CategoryState = {
    categoryList: (GetCategoryResponseDTO & {
        productList: GetProductResponseDTO[];
        productAmount: number;
        page: number;
        take: number;
    })[];
    page: number;
    take: number;
    max?: number;
};

const initialState: ReducerState<CategoryState> = {
    data: {
        categoryList: [],
        page: 1,
        take: 5,
    },
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

const categoryReducer = (
    state: ReducerState<CategoryState> = initialState,
    action: Action
): ReducerState<CategoryState> => {
    const oldCategoryList = state.data.categoryList;
    switch (action.type) {
        case ActionTypes.GET_CATEGORY_LIST:
            return {
                ...state,
                loading: true,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_CATEGORY_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: {
                    ...state.data,
                    categoryList: [
                        ...oldCategoryList,
                        ...action.payload.categoryList.map((c) => {
                            return {
                                ...c,
                                page: 1,
                                take: 5,
                                productList: [],
                                productAmount: -1,
                            };
                        }),
                    ],
                    page: state.data.page + 1,
                    max: action.payload.amount,
                },
                error: '',
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.GET_CATEGORY_LIST_FAILED:
            return {
                ...state,
                data: state.data,
                loading: false,
                error: action.payload,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY:
            return {
                ...state,
                loading: true,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    categoryList: oldCategoryList.map((category, index) => {
                        if (category.id === action.payload.categoryId)
                            return {
                                ...category,
                                productList: action.payload.productList,
                                productAmount: action.payload.max,
                                page:
                                    category.productAmount === 0
                                        ? action.payload.page || 0
                                        : category.page + 1,
                                take: action.payload?.take || category.take,
                            };

                        return category;
                    }),
                },
                loading: false,
                error: '',
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.GET_PRODUCT_LIST_BY_CATEGORY_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: ResponseStatus.FAILED,
            };

        default:
            return state;
    }
};

export default categoryReducer;
