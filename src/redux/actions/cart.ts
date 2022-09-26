import { GetProductResponseDTO } from './../../models/dto/ProductDTO';
import { ActionTypes } from '../action-types';
export type CartAction =
    | AddToCartAction
    | ModifyProductCartAction
    | RemoveProductCartAction
    | ClearCartAction;

type AddToCartAction = {
    type: ActionTypes.ADD_TO_CART;
    payload: GetProductResponseDTO;
};

type ModifyProductCartAction = {
    type: ActionTypes.MODIFY_PRODUCT_CART;
    payload: GetProductResponseDTO;
};

type RemoveProductCartAction = {
    type: ActionTypes.REMOVE_PRODUCT_CART;
    payload: number;
};

type ClearCartAction = {
    type: ActionTypes.CLEAR_CART;
};
