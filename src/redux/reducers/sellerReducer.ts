import { ReducerState } from '.';
import { GetUserPageResponseDTO, ResponseStatus } from '../../models';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

type SellerState = Partial<GetUserPageResponseDTO>;
const initialState: ReducerState<SellerState> = {
    data: {},
    error: '',
    loading: false,
    status: ResponseStatus.NOT_RESPONSE,
};

export const sellerReducer = (
    state: ReducerState<SellerState> = initialState,
    action: Action
): ReducerState<SellerState> => {
    switch (action.type) {
        case ActionTypes.GET_USER_PAGE:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_USER_PAGE_SUCCESS:
            return {
                loading: false,
                error: '',
                data: {
                    ...state.data,
                    ...action.payload,
                },
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.GET_USER_PAGE_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.CREATE_UPDATE_USER_PAGE:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CREATE_UPDATE_USER_PAGE_SUCCESS:
            return {
                loading: false,
                error: '',
                data: {
                    ...state.data,
                    ...action.payload,
                },
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.CREATE_UPDATE_USER_PAGE_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.CHANGE_USER_PAGE_AVATAR:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CHANGE_USER_PAGE_AVATAR_SUCCESS:
            return {
                loading: false,
                error: '',
                data: {
                    ...state.data,
                    pageAvatar: action.payload,
                },
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.CHANGE_USER_PAGE_AVATAR_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.CHANGE_USER_PAGE_BANNER:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CHANGE_USER_PAGE_BANNER_SUCCESS:
            return {
                loading: false,
                error: '',
                data: {
                    ...state.data,
                    bannerUrl: action.payload,
                },
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.CHANGE_USER_PAGE_BANNER_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: state.data,
                status: ResponseStatus.FAILED,
            };
        default:
            return state;
    }
};
