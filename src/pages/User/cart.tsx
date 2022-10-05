import React from 'react'
import { Container } from 'react-bootstrap';
import { useTypedSelector } from '../../hooks'

export const CartPage: React.FC<{}> = () => {
    const {data: {itemList}} = useTypedSelector(s => s.cart);
    
    return (
        <section>
                <header style={{
                    width: '100%',
                    height:'3rem',
                    background: 'var(--clr-logo)',
                    color:'#fff',
                    fontWeight:'500',
                    padding: '12px',
                    display: "inline-block"
                }}>
                    <Container> 
                        <p style={{color: 'inherit'}}>
                            {[
                            "Product", "Your Cart"
                            ].join(" > ")}
                        </p>
                    </Container>    
                </header>
                <Container>
                    <h3 className="py-3"
                    style={{textTransform: 'uppercase', fontWeight: '700'}}>
                        Your cart 
                        <span style={{fontSize: '1.2rem'}}>({itemList.length} ITEM)</span>
                    </h3>
                    <table style={{width: '100%'}}>
                        <tr>
                            <th className='p-2'>ITEM</th>
                            <th className='p-2'>PRICE</th>
                            <th className='p-2'>QUANTITY</th>
                            <th className='p-2'>TOTAL</th>
                        </tr>
                        {
                            itemList.map((cartItem,index) =>{
                                return <tr>
                                    <td>
                                        <div>
                                            <div style={{background: `url(${cartItem.image}) center / contain`}}>
        
                                            </div>
                                        </div>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            })
                        }
                    </table>
                </Container>
        </section>
    )
}