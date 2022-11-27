import { GetProductResponseDTO } from './../../models/dto/ProductDTO';
import { ReducerState } from '.';
import { ResponseStatus } from '../../models';
import { ActionTypes, Action } from '..';

type SingleProductOverview = {
    productId: number;
    detailIndexes?: (number | undefined)[];
    price: number;
    quantity: number;
    image: string;
    addressId: number;
    total: number;
    item: GetProductResponseDTO;
    checked: boolean;
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
            console.log("add to cart")
            const { detailIndexes, quantity, price, image, addressId } =
                action.payload;
            const { id } = action.payload.product;

            const newItem = {
                productId: id,
                item: action.payload.product,
                addressId: action.payload.addressId,
                detailIndexes: detailIndexes,
                price: price,
                quantity: quantity,
                total: price,
                image: image,
                checked: true,
            } as SingleProductOverview;
            console.log("new",newItem);
            const newAdditionalProductList = oldItemList.some((item) => {
                return (
                    item.productId === id &&
                    addressId === item.addressId &&
                    item?.detailIndexes?.every((di,index) => detailIndexes?.[index] === di)
                );
            })
                ? // Already item
                  oldItemList.map((item) => {
                      if (
                          item.productId === id &&
                          addressId === item.addressId &&
                          item.detailIndexes === detailIndexes
                      ) {
                          return {
                              ...item,
                              quantity: item.quantity + 1,
                              total: updateSingleCartItemPrice(
                                  item.price,
                                  item.quantity + 1
                              ),
                          };
                      }
                      return item;
                  })
                : // Not find item
                  [...oldItemList, newItem];

            return {
                ...state,
                data: {
                    ...state.data,
                    itemList: newAdditionalProductList,
                    ...updateStateDataTotalAndQuantity(
                        newAdditionalProductList
                    ),
                },
            };

        case ActionTypes.CHECK_CART_ITEM:
            return {
                ...state,
                data: {
                    ...state.data,
                    itemList: oldItemList.map((item, index) => {
                        if (index === action.payload) {
                            return {
                                ...item,
                                checked: !item.checked,
                            };
                        }
                        return item;
                    }),
                },
            };

        case ActionTypes.MODIFY_PRODUCT_CART:
            const newModifiedCartList = oldItemList.map((item, index) => {
                const isMapped = index === action.payload.index;
                return isMapped
                    ? {
                          ...item,
                          quantity: action.payload.quantity,
                          addressId: action.payload.addressId,
                          total: updateSingleCartItemPrice(
                              item.price,
                              action.payload.quantity
                          ),
                      }
                    : item;
            });

            return {
                ...state,
                data: {
                    ...state.data,
                    itemList: newModifiedCartList,
                    ...updateStateDataTotalAndQuantity(newModifiedCartList),
                },
            };

        case ActionTypes.REMOVE_PRODUCT_CART:
            const newItemList = oldItemList.filter(
                (_, index) => index !== action.payload
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

function updateSingleCartItemPrice(price: number, quantity: number): number {
    return price * quantity;
}

function updateStateDataTotalAndQuantity(list: SingleProductOverview[]): {
    totalPrice: number;
    totalAmount: number;
} {
    return list.reduce(
        (store, item) => {
            return {
                totalPrice: store.totalPrice + item.total,
                totalAmount: store.totalAmount + item.quantity,
            };
        },
        { totalPrice: 0, totalAmount: 0 }
    );
}
