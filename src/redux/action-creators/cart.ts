import { Dispatch } from 'react';
import { GetProductResponseDTO } from '../../models';
import { ActionTypes, Action } from '..';

export const addToCart = (
    product: GetProductResponseDTO,
    addressId: number,
    detailIndex?: number,
    quantity?: number
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.ADD_TO_CART,
            payload: {
                quantity: quantity || 1,
                product: product,
                detailIndex: detailIndex,
                price: !!detailIndex
                    ? product.productDetails?.[detailIndex].price
                    : product.price,
                image:
                    (!!detailIndex &&
                        product.productDetails?.[detailIndex].presentImage) ||
                    product.urls?.[0],
                addressId,
            },
        });
    };
};

export const checkCartItem = (cartItemIndex: number) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CHECK_CART_ITEM,
            payload: cartItemIndex,
        });
    };
};

export const modifyItemCart = (
    index: number,
    productId: number,
    quantity: number,
    addressId: number
) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.MODIFY_PRODUCT_CART,
            payload: {
                index,
                productId,
                quantity,
                addressId,
            },
        });
    };
};

export const removeItemFromCart = (index: number) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.REMOVE_PRODUCT_CART,
            payload: index,
        });
    };
};

export const clearCart = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.CLEAR_CART,
        });
    };
};
