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
    | IUpdateUserInfoFailedAction;

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
