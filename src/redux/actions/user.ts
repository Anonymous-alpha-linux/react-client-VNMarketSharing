import { GetAddressResponseDTO } from '../../models';
import { ActionTypes } from '../action-types';

export type UserAction =
    | IChangeAvatarAction
    | IChangeAvatarSuccessAction
    | IChangeAvatarFailedAction
    | IGetUserInfoAction
    | IGetUserInfoSuccessAction
    | IGetUserInfoErrorAction
    | IUpdateUserInfoAction
    | IUpdateUserInfoSuccessAction
    | IUpdateUserInfoFailedAction
    | IGetAddressListAction
    | IGetAddressListSuccessAction
    | IGetAddressListFailedAction;

export interface IGetUserInfoAction {
    type: ActionTypes.GET_USER_INFO;
}
export interface IGetUserInfoSuccessAction {
    type: ActionTypes.GET_USER_INFO_SUCCESS;
    payload: {
        userId: string;
        username: string;
        avatar: string;
    };
}
export interface IGetUserInfoErrorAction {
    type: ActionTypes.GET_USER_INFO_ERROR;
    payload: string;
}

export interface IChangeAvatarAction {
    type: ActionTypes.CHANGE_AVATAR;
}
export interface IChangeAvatarSuccessAction {
    type: ActionTypes.CHANGE_AVATAR_SUCCESS;
    payload: {
        image: string;
    };
}
export interface IChangeAvatarFailedAction {
    type: ActionTypes.CHANGE_AVATAR_ERROR;
    payload: string;
}

export interface IUpdateUserInfoAction {
    type: ActionTypes.UPDATE_USER_INFO;
}
export interface IUpdateUserInfoSuccessAction {
    type: ActionTypes.UPDATE_USER_INFO_SUCCESS;
    payload: {
        organizationName: string;
    };
}
export interface IUpdateUserInfoFailedAction {
    type: ActionTypes.UPDATE_USER_INFO_ERROR;
    payload: string;
}

export interface IGetAddressListAction {
    type: ActionTypes.GET_ADDRESS_LIST;
}

export interface IGetAddressListSuccessAction {
    type: ActionTypes.GET_ADDRESS_LIST_SUCCESS;
    payload: GetAddressResponseDTO[];
}

export interface IGetAddressListFailedAction {
    type: ActionTypes.GET_ADDRESS_LIST_FAILED;
    payload: string;
}
