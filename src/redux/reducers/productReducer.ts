import { ReducerState } from '.';
import { ResponseStatus } from '../../models';
import { ActionTypes, Action } from '..';

type ProductState = {};

const initialState: ReducerState<ProductState> = {
    data: {},
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

const productReducer = (
    state: ReducerState<ProductState> = initialState,
    action: Action
): ReducerState<ProductState> => {
    switch (action.type) {
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
