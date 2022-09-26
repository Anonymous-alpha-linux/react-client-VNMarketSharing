import { Dispatch } from 'react';
import { GetProductResponseDTO } from '../../models';
import { ActionTypes, Action } from '..';

export const addToCart = (product: GetProductResponseDTO) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.ADD_TO_CART,
            payload: product,
        });
    };
};

export const removeItemFromCart = (productId: number) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionTypes.REMOVE_PRODUCT_CART,
            payload: productId,
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
