import { ResponseStatus } from '../../models';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

interface UserState {
    data: {
        username: string;
        avatar: string;
    };
    loading: boolean;
    error: string;
    status?: ResponseStatus;
}

const initialState: UserState = {
    data: {
        username: '',
        avatar: '',
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
                    avatar: action.payload.image,
                    username: state.data.username,
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

        default:
            return state;
    }
}
