import React from 'react'
import { Stack } from 'react-bootstrap';
import { useTypedSelector } from '../../hooks'

export function CartContainer() {
    const {data: {totalPrice}} = useTypedSelector(state => state.cart);

    return (
        <div className='cart__container'>
            <CartList></CartList>
            <div>
                <label>
                    Total price
                </label>
                <span>{totalPrice}</span>
            </div>
        </div>
    )
}   




export const CartList = () =>{
    const {data: {itemList}} = useTypedSelector(s => s.cart);
    
    return <>
        <Stack gap={3}>
            {itemList.map((cartItem,index) =>{
                return <div key={index + 1}>
                    <h4>
                        {cartItem.item.name}
                    </h4>
                    <i>{cartItem.quantity}</i>
                    <p>{cartItem.total}</p>
                    <div>
                        <input type='number'></input>
                    </div>
                </div>
            })}
        </Stack>
    </>
}
