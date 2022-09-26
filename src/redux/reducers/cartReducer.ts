import { GetProductResponseDTO } from './../../models/dto/ProductDTO';
import { ReducerState } from '.';
import { ResponseStatus } from '../../models';
import { ActionTypes, Action } from '..';

type SingleProductOverview = {
    productId: number;
    item: GetProductResponseDTO;
    quantity: number;
    total: number;
};
type CartState = {
    itemList: SingleProductOverview[];
    totalAmount: number;
    totalPrice: number;
};

const initialState: ReducerState<CartState> = {
    data: {
        itemList: [],
        totalAmount: 0,
        totalPrice: 0,
    },
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

export const cartReducer = (
    state: ReducerState<CartState> = initialState,
    action: Action
): ReducerState<CartState> => {
    const oldItemList = state.data.itemList;
    switch (action.type) {
        case ActionTypes.ADD_TO_CART:
            const productId = action.payload.id;
            const newItem = {
                productId: action.payload.id,
                item: action.payload,
                quantity: 1,
                total: action.payload.price,
            };

            return {
                ...state,
                data: {
                    itemList: oldItemList.some(
                        (item) => item.productId === productId
                    )
                        ? // Already item
                          oldItemList.map((item) => {
                              if (item.productId === productId) {
                                  return {
                                      ...item,
                                      quantity: item.quantity + 1,
                                      total: item.total + action.payload.price,
                                  };
                              }
                              return item;
                          })
                        : // Not find item
                          [...oldItemList, newItem],
                    totalAmount: state.data.totalAmount + 1,
                    totalPrice: [...oldItemList, newItem].reduce(
                        (pre, cur) => pre + cur.total,
                        0
                    ),
                },
            };

        case ActionTypes.MODIFY_PRODUCT_CART:
            return {
                ...state,
            };

        case ActionTypes.REMOVE_PRODUCT_CART:
            const productRemovedId = action.payload;
            const newItemList = oldItemList.filter(
                (item) => item.productId === productRemovedId
            );
            return {
                ...state,
                data: {
                    itemList: newItemList,
                    totalAmount: newItemList.length,
                    totalPrice: newItemList.reduce(
                        (pre, cur) => pre + cur.total,
                        0
                    ),
                },
            };

        case ActionTypes.CLEAR_CART:
            return {
                ...state,
                data: {
                    itemList: [],
                    totalAmount: 0,
                    totalPrice: 0,
                },
            };

        default:
            return state;
    }
};
