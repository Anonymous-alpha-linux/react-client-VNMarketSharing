import { ActionTypes } from '../action-types';
import { GetUserPageResponseDTO } from '../../models';

export type SellerAction =
    | IGetUserPageAction
    | IGetUserPageSuccessAction
    | IGetUserPageFailedAcion
    | IPostUserPageAction
    | IPostUserPageSuccessAction
    | IPostUserPageFailedAction
    | IChangeUserPageAvatar
    | IChangeUserPageAvatarSuccess
    | IChangeUserPageAvatarFailed
    | IChangeUserPageBanner
    | IChangeUserPageBannerSuccess
    | IChangeUserPageBannerFailed;

export interface IGetUserPageAction {
    type: ActionTypes.GET_USER_PAGE;
}

export interface IGetUserPageSuccessAction {
    type: ActionTypes.GET_USER_PAGE_SUCCESS;
    payload: GetUserPageResponseDTO;
}

export interface IGetUserPageFailedAcion {
    type: ActionTypes.GET_USER_PAGE_FAILED;
    payload: string;
}

export interface IPostUserPageAction {
    type: ActionTypes.CREATE_UPDATE_USER_PAGE;
}

export interface IPostUserPageSuccessAction {
    type: ActionTypes.CREATE_UPDATE_USER_PAGE_SUCCESS;
    payload: GetUserPageResponseDTO;
}

export interface IPostUserPageFailedAction {
    type: ActionTypes.CREATE_UPDATE_USER_PAGE_FAILED;
    payload: string;
}

export interface IChangeUserPageAvatar {
    type: ActionTypes.CHANGE_USER_PAGE_AVATAR;
}

export interface IChangeUserPageAvatarSuccess {
    type: ActionTypes.CHANGE_USER_PAGE_AVATAR_SUCCESS;
    payload: string;
}

export interface IChangeUserPageAvatarFailed {
    type: ActionTypes.CHANGE_USER_PAGE_AVATAR_FAILED;
    payload: string;
}

export interface IChangeUserPageBanner {
    type: ActionTypes.CHANGE_USER_PAGE_BANNER;
}

export interface IChangeUserPageBannerSuccess {
    type: ActionTypes.CHANGE_USER_PAGE_BANNER_SUCCESS;
    payload: string;
}

export interface IChangeUserPageBannerFailed {
    type: ActionTypes.CHANGE_USER_PAGE_BANNER_FAILED;
    payload: string;
}
