export enum ActionTypes {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    REGISTER,
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    LOGOUT,
    LOGOUT_SUCCESS,
    LOGOUT_FAILED,
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_FAILED,
    SAVE_JWT_TOKEN,
    SAVE_JWT_TOKEN_SUCCESS,
    SAVE_JWT_TOKEN_FAILED,
    REFRESH_JWT_TOKEN,
    REFRESH_JWT_TOKEN_SUCCESS,
    REFRESH_JWT_TOKEN_FAILED,
    CONFIRM_ACCOUNT,
    CONFIRM_ACCOUNT_SUCCESS,
    CONFIRM_ACCOUNT_FAILED,
    SEND_EMAIL_TO_CHANGE_PASSWORD,
    SEND_EMAIL_TO_CHANGE_PASSWORD_SUCCESS,
    SEND_EMAIL_TO_CHANGE_PASSWORD_ERROR,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_ERROR,
    RESET_STATUS,
    RESET_ERROR,
    GET_USER_INFO,
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_ERROR,
    CHANGE_AVATAR,
    CHANGE_AVATAR_SUCCESS,
    CHANGE_AVATAR_ERROR,
    UPDATE_USER_INFO,
    UPDATE_USER_INFO_SUCCESS,
    UPDATE_USER_INFO_ERROR,
    UPDATE_LOCAL_STORAGE,
    GET_PRODUCT_LIST,
    GET_PRODUCT_LIST_SUCCESS,
    GET_PRODUCT_LIST_FAILED,
    POST_NEW_PRODUCT,
    POST_NEW_PRODUCT_SUCCESS,
    POST_NEW_PRODUCT_FAILED,
    UPDATE_NEW_PRODUCT,
    UPDATE_NEW_PRODUCT_SUCCESS,
    UPDATE_NEW_PRODUCT_FAILED,
    GET_ADDRESS_LIST,
    GET_ADDRESS_LIST_SUCCESS,
    GET_ADDRESS_LIST_FAILED,
    GET_USER_PAGE,
    GET_USER_PAGE_SUCCESS,
    GET_USER_PAGE_FAILED,
    CREATE_UPDATE_USER_PAGE,
    CREATE_UPDATE_USER_PAGE_SUCCESS,
    CREATE_UPDATE_USER_PAGE_FAILED,
    CHANGE_USER_PAGE_AVATAR,
    CHANGE_USER_PAGE_AVATAR_SUCCESS,
    CHANGE_USER_PAGE_AVATAR_FAILED,
    CHANGE_USER_PAGE_BANNER,
    CHANGE_USER_PAGE_BANNER_SUCCESS,
    CHANGE_USER_PAGE_BANNER_FAILED,
    ADD_TO_CART,
    CHECK_CART_ITEM,
    REDUCE_CART_ITEM,
    MODIFY_PRODUCT_CART,
    REMOVE_PRODUCT_CART,
    CLEAR_CART,
    GET_CATEGORY_LIST,
    GET_CATEGORY_LIST_SUCCESS,
    GET_CATEGORY_LIST_FAILED,
    GET_PRODUCT_LIST_BY_CATEGORY,
    GET_PRODUCT_LIST_BY_CATEGORY_SUCCESS,
    GET_PRODUCT_LIST_BY_CATEGORY_FAILED,
    GET_REVIEW_LIST,
    GET_REVIEW_LIST_SUCCESS,
    GET_REVIEW_LIST_FAILED,
    CREATE_NEW_REVIEW,
    CREATE_NEW_REVIEW_SUCCESS,
    CREATE_NEW_REVIEW_FAILED,
    UPDATE_REVIEW,
    UPDATE_REVIEW_SUCCESS,
    UPDATE_REVIEW_FAILED,
}

export * from './image';
