import { GetAddressResponseDTO, ResponseStatus } from '../../models';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

interface UserState {
    data: {
        userId: string;
        username: string;
        avatar: string;
        addressList: GetAddressResponseDTO[];
    };
    loading: boolean;
    error: string;
    status?: ResponseStatus;
}

const initialState: UserState = {
    data: {
        userId: '',
        username: '',
        avatar: '',
        addressList: [],
    },
    error: '',
    loading: false,
    status: ResponseStatus.NOT_RESPONSE,
};

export default function userReducer(
    state: UserState = initialState,
    action: Action
): UserState {
    switch (action.type) {
        case ActionTypes.GET_USER_INFO:
            return {
                loading: true,
                data: state.data,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_USER_INFO_SUCCESS:
            return {
                loading: false,
                data: {
                    ...state.data,
                    userId: action.payload.userId,
                    avatar: action.payload.avatar,
                    username: action.payload.username,
                },
                error: '',
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.GET_USER_INFO_ERROR:
            return {
                loading: false,
                data: state.data,
                error: action.payload,
                status: ResponseStatus.FAILED,
            };
        case ActionTypes.CHANGE_AVATAR:
            return {
                loading: true,
                data: state.data,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CHANGE_AVATAR_SUCCESS:
            return {
                loading: false,
                data: {
                    ...state.data,
                    avatar: action.payload.image,
                },
                error: '',
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.CHANGE_AVATAR_ERROR:
            return {
                loading: false,
                data: state.data,
                error: action.payload,
                status: ResponseStatus.FAILED,
            };
        case ActionTypes.UPDATE_USER_INFO:
            return {
                ...state,
                loading: true,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.UPDATE_USER_INFO_SUCCESS:
            return {
                loading: false,
                status: ResponseStatus.SUCCESS,
                error: '',
                data: {
                    ...state.data,
                    username: action.payload.organizationName,
                },
            };
        case ActionTypes.UPDATE_USER_INFO_ERROR:
            return {
                loading: false,
                status: ResponseStatus.FAILED,
                error: action.payload,
                data: state.data,
            };
        case ActionTypes.GET_ADDRESS_LIST:
            return {
                ...state,
                loading: true,
                status: ResponseStatus.NOT_RESPONSE,
                error: '',
            };
        case ActionTypes.GET_ADDRESS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                status: ResponseStatus.SUCCESS,
                error: '',
                data: {
                    ...state.data,
                    addressList: action.payload,
                },
            };
        case ActionTypes.GET_ADDRESS_LIST_FAILED:
            return {
                ...state,
                loading: false,
                status: ResponseStatus.FAILED,
                error: action.payload,
            };
        default:
            return state;
    }
}
