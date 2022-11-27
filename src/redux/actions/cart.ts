import { GetProductResponseDTO } from './../../models/dto/ProductDTO';
import { ActionTypes } from '../action-types';
export type CartAction =
    | AddToCartAction
    | ModifyProductCartAction
    | CheckCartItem
    | RemoveProductCartAction
    | ClearCartAction;

type AddToCartAction = {
    type: ActionTypes.ADD_TO_CART;
    payload: {
        product: GetProductResponseDTO;
        detailIndexes?: (number | undefined)[];
        quantity: number;
        price: number;
        image: string;
        addressId: number;
    };
};

type CheckCartItem = {
    type: ActionTypes.CHECK_CART_ITEM;
    payload: number;
};

type ReduceCartItem = {
    type: ActionTypes.REDUCE_CART_ITEM;
    payload: number;
};

type ModifyProductCartAction = {
    type: ActionTypes.MODIFY_PRODUCT_CART;
    payload: {
        index: number;
        productId: number;
        quantity: number;
        addressId: number;
    };
};

type RemoveProductCartAction = {
    type: ActionTypes.REMOVE_PRODUCT_CART;
    payload: number;
};

type ClearCartAction = {
    type: ActionTypes.CLEAR_CART;
};
