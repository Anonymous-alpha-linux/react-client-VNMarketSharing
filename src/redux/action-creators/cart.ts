import { Dispatch } from 'redux';
import { GetProductResponseDTO } from '../../models';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

export const addToCart = (
    product: GetProductResponseDTO,
    addressId: number,
    detailIndexes?: (number|undefined)[],
    quantity?: number,
    options?: {
        onError: (message: string) => void;
    }
) => {
    return async (dispatch: Dispatch<Action>) => {
        if (!product) {
            return;
        }
        dispatch({
            type: ActionTypes.ADD_TO_CART,
            payload: {
                quantity: quantity || 1,
                product: product,
                detailIndexes: detailIndexes,
                price: product.productDetails?.find(p => detailIndexes?.[0] && detailIndexes?.[1] && p.productClassifyKeyId === detailIndexes?.[0] && p.productClassifyValueId === detailIndexes?.[1])?.price
                    || product.productDetails?.find(p => detailIndexes?.[0] && p.productClassifyKeyId === detailIndexes?.[0])?.price 
                    || product.price,
                image: product.productDetails?.find(p => detailIndexes?.[0] && detailIndexes?.[1] && p.productClassifyKeyId === detailIndexes?.[0] && p.productClassifyValueId === detailIndexes?.[1])?.presentImage
                || product.productDetails?.find(p => detailIndexes?.[0] && p.productClassifyKeyId === detailIndexes?.[0])?.presentImage 
                || product.urls?.[0],
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
