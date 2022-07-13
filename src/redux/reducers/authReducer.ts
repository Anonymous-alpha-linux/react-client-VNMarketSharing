import { ActionTypes, AuthAction } from '..';
import { ResponseStatus } from '../../models';

interface AuthState {
    data: {
        email: string;
        role: string;
        isAuthorized: boolean;
    };
    loading: boolean;
    error: string;
    status?: ResponseStatus;
}

const initialState: AuthState = {
    data: {
        email: '',
        role: '',
        isAuthorized: false,
    },
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

const authReducer = (
    state: AuthState = initialState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {
                loading: false,
                error: '',
                data: action.payload,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.LOGIN_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: initialState.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.REGISTER:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.REGISTER_SUCCESS:
            return {
                loading: false,
                error: '',
                data: state.data,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.REGISTER_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.LOGOUT:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return { ...initialState, status: ResponseStatus.SUCCESS };
        case ActionTypes.LOGOUT_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.GET_USER:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_USER_SUCCESS:
            return {
                loading: false,
                error: '',
                data: action.payload,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.GET_USER_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: initialState.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.CONFIRM_ACCOUNT:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CONFIRM_ACCOUNT_SUCCESS:
            return {
                loading: false,
                error: '',
                data: action.payload,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.CONFIRM_ACCOUNT_FAILED:
            return {
                loading: false,
                error: '',
                data: state.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.REFRESH_JWT_TOKEN:
            return {
                loading: true,
                error: '',
                data: state.data,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.REFRESH_JWT_TOKEN_SUCCESS:
            return {
                loading: false,
                error: '',
                status: ResponseStatus.SUCCESS,
                data: {
                    email: state.data?.email,
                    role: state.data?.role,
                    isAuthorized: true,
                },
            };
        case ActionTypes.REFRESH_JWT_TOKEN_FAILED:
            return {
                loading: false,
                error: action.payload,
                data: initialState.data,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.RESET_ERROR:
            return {
                error: '',
                loading: false,
                data: state.data,
                status: state.status,
            };
        case ActionTypes.RESET_STATUS:
            return {
                data: state.data,
                loading: false,
                error: state.error,
                status: ResponseStatus.NOT_RESPONSE,
            };

        case ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD:
            return {
                data: state.data,
                error: '',
                loading: true,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_SUCCESS:
            return {
                data: state.data,
                error: '',
                loading: false,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR:
            return {
                data: state.data,
                error: action.payload,
                loading: false,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.CHANGE_PASSWORD:
            return {
                data: state.data,
                error: '',
                loading: true,
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CHANGE_PASSWORD_SUCCESS:
            return {
                data: state.data,
                error: '',
                loading: false,
                status: ResponseStatus.SUCCESS,
            };
        case ActionTypes.CHANGE_PASSWORD_ERROR:
            return {
                data: state.data,
                error: action.payload,
                loading: false,
                status: ResponseStatus.FAILED,
            };

        default:
            return state;
    }
};

export default authReducer;
