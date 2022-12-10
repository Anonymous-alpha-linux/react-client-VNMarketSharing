import { GetAddressResponseDTO, GetNotificationDTO, GetNotificationTrackerDTO } from '../../models';
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
    | IGetAddressListFailedAction
    | IGetNotificationListAction
    | IGetNotificationListSuccessAction
    | IGetNotificationListFailedAction
    | IPushNotificationAction
    | IPushNotificationSuccessAction
    | IPushNotificationFailureAction;

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

export interface IGetNotificationListAction{
    type: ActionTypes.GET_NOTIFICATIONS;
}

export interface IGetNotificationListSuccessAction{
    type: ActionTypes.GET_NOTIFICATIONS_SUCCESS;
    payload: GetNotificationTrackerDTO[];
}

export interface IGetNotificationListFailedAction{
    type: ActionTypes.GET_NOTIFICATIONS_FAILED;
    payload: string;
}

export interface IPushNotificationAction {
    type: ActionTypes.PUSH_NEW_NOTIFICATION;
}

export interface IPushNotificationSuccessAction {
    type: ActionTypes.PUSH_NEW_NOTIFICATION_SUCCESS;
    payload: GetNotificationTrackerDTO;
}

export interface IPushNotificationFailureAction {
    type: ActionTypes.PUSH_NEW_NOTIFICATION_FAILED;
    payload: string;
}