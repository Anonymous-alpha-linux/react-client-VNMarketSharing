import React from 'react'
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { FaPlusSquare } from 'react-icons/fa';
import { paymentAPIInstance } from '../../config';
import { axiosErrorHandler, useTypedSelector } from '../../hooks';
import { GetInvoiceResponseDTO, GetOrderResponseDTO } from '../../models';
import './order.css'
type OrderShowState = {
    loading: boolean;
    error: string;
    data: {
        invoiceList: GetInvoiceResponseDTO[];
    };
    mode: "order" | "invoice";
}

export const OrderShow: React.FC<{}> = () => {
    const {data: {userId}} = useTypedSelector(s => s.user);
    const [state, setState] = React.useState<OrderShowState>({
        loading: false,
        error: '',
        data: {
            invoiceList: []
        },
        mode: 'invoice'
    });

    function setInvoiceList(invoiceList: GetInvoiceResponseDTO[]){
        setState(o =>{
            return {
                ...o,
                data: {
                    ...o.data,
                    invoiceList: invoiceList
                }
            }
        })
    }
    function changeMode(mode: "order" |'invoice'){
        setState(o =>({
            ...o,
            mode
        }));
    }

    React.useEffect(() =>{
        axiosErrorHandler(()=>{
            paymentAPIInstance.getMyOrder(Number(userId)).then(response => {
                const {data} = response;
                if(Array.isArray(data)){
                    setInvoiceList(data);
                }
            });
        })
    },[]);

    return (
        <section>
            <>
                <h3>{state.mode === "invoice" ? "Invoice" : "Order"} List</h3>
                <Row className="order-show__button--group py-3">
                    <Col xs="auto" sm="auto">
                        <Button onClick={() => changeMode("invoice")}>Invoice</Button>
                    </Col>
                    <Col xs="auto" sm="auto">
                        <Button onClick={() => changeMode("order")}>Orders</Button>
                    </Col>
                </Row>
                <Row className="p-3">
                    <Form.Control placeholder='Search order such as Id, Shopper, Product name'></Form.Control>
                </Row>
                <Row className="py-3 order-show__list">
                    { 
                    state.mode === "invoice" &&
                        state.data.invoiceList.map((invoice,index) =>{
                            return <Col xs="auto" sm="auto" key={index + 1}>
                                <InvoiceCard invoice={invoice}></InvoiceCard>
                            </Col>
                        }) ||
                        <OrderList orderList={state.data.invoiceList.map(invoice => invoice.orders).flat()}></OrderList>
                    }
                </Row>
            </>
        </section>
    )
}

const InvoiceCard = ({invoice, ...props}: {invoice: GetInvoiceResponseDTO}) =>{
    return <article className='invoice-card__root py-2'>
        <div className="invoice-card__container p-2">
            <Row>
                <Col>
                    Invoice No.
                </Col>
                <Col>
                    <p>{invoice.id}</p>
                </Col>
            </Row>

            <Row>
                <Col>
                    Values :
                </Col>
                <Col>
                    <p>{
                    `${invoice.cashAmount.toLocaleString("en-US", {
                        maximumFractionDigits: 0
                    })} VND`}</p>
                </Col>
            </Row>

            <Row>
                <Col>
                    Transaction code:
                </Col>
                <Col>
                    <p data-pointer title={invoice.onlineRef}>
                        {invoice.onlineRef.substring(0, 12)}...
                    </p>
                </Col>
            </Row>

            <Row>
                <Col>
                    Bank:
                </Col>
                <Col>
                    <p>
                        {invoice.bank}
                    </p>
                </Col>
            </Row>

            <Row>
                <Col>
                    Status:
                </Col>
                <Col>
                    <p>
                        {invoice.hasPaid ? "Completed" : "Not yet"}
                    </p>
                </Col>
            </Row>

            <Row>
                <Col>
                    Orders :
                </Col>
                <Col>
                    <span>
                        <b>
                            {invoice.orders.length}
                        </b>
                    </span>
                    <span className="invoice-card__order--trigger">
                        <FaPlusSquare></FaPlusSquare>
                    </span>
                </Col>
            </Row>
        </div>
    </article>
}

const OrderList = ({orderList, ...props}: {orderList: GetOrderResponseDTO[]}) =>{
    return <>
        {orderList.map((order,index) => {
            return <Col xs="auto" sm="auto" key={index + 1}>
                <OrderCard order={order}></OrderCard>
            </Col>
        })}
    </>
}

const OrderCard = ({order, ...props}: {order: GetOrderResponseDTO}) =>{
    return <article className="order-card__root py-2">
        <div className="order-card__container p-3">
            <h4>Order Card</h4>
            <div className='order-card__body'>
                <Row>
                    <Col>Order No :</Col>
                    <Col data-text-align={"right"}>{order.id}</Col>
                </Row>
                <Row>
                    <Col>Product Name :</Col>
                    <Col data-text-align={"right"}>{order.productName}</Col>
                </Row>
                <Row>
                    <Col>To :</Col>
                    <Col data-text-align={"right"}>{order.address}</Col>
                </Row>
                <Row>
                    <Col>Amount :</Col>
                    <Col data-text-align={"right"}>{order.amount}</Col>
                </Row>
                <Row>
                    <Col>Total :</Col>
                    <Col data-text-align={"right"}>{order.price.toLocaleString("en-US", {maximumFractionDigits: 0})}</Col>
                </Row>
                <Row>
                    <Col>Transaction Ref :</Col>
                    <Col data-text-align={"right"}>{order.invoiceRef.substring(0,10)}...</Col>
                </Row>
                <Row>
                    <Col>Status :</Col>
                    <Col data-text-align={"right"}>{order.orderStatus}</Col>
                </Row>
            </div>
        </div>
    </article>
}