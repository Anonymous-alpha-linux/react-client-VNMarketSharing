import React from 'react'
import { Button, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { FaPlusSquare } from 'react-icons/fa';
import { paymentAPIInstance } from '../../config';
import { axiosErrorHandler, useTypedSelector } from '../../hooks';
import { GetInvoiceResponseDTO, GetOrderResponseDTO, OrderStatus } from '../../models';
import './order.css'
import { CustomLink } from '../../components';
type OrderShowState = {
    loading: boolean;
    error: string;
    data: {
        invoiceList: GetInvoiceResponseDTO[];
        orderList: GetOrderResponseDTO[];
    };
    show: {
        invoiceList: GetInvoiceResponseDTO[];
        orderList: GetOrderResponseDTO[];
    },
    filters: {
        pattern: string;
        invoiceRef:string;
        orderStatus: OrderStatus;
        hasPaid: boolean;
        dateOfOrder: OrderFilterByDate;
    },
    mode: "order" | "invoice";
}
enum OrderFilterByDate {
    nothing = "",
    today = "today",
    yesterday = "yesterday",
    threeDaysAgo = "3 days ago",
    lastWeek = "last week",
    lastMonth = "last month",
    lastYear = "last year"
}

export const OrderShow: React.FC<{}> = () => {
    const {data: {userId}} = useTypedSelector(s => s.user);
    const [state, setState] = React.useState<OrderShowState>({
        loading: false,
        error: '',
        data: {
            invoiceList: [],
            orderList: []
        },
        show: {
            invoiceList: [],
            orderList: []
        },
        filters: {
            pattern: '',
            invoiceRef: '',
            orderStatus: OrderStatus.Pending,
            hasPaid: true,
            dateOfOrder: OrderFilterByDate.nothing
        },
        mode: 'invoice'
    });
    const timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const functions = {
        setInvoiceList(invoiceList: GetInvoiceResponseDTO[]){
            setState(o =>{
                const orderList = invoiceList.map(p => p.orders).flat();
                return {
                    ...o,
                    data: {
                        ...o.data,
                        invoiceList: invoiceList,
                        orderList: orderList
                    },
                    show: {
                        ...o.show,
                        invoiceList: invoiceList,
                        orderList: orderList
                    }
                }
            })
        },
        load(load: boolean){
            setState(o =>({
                ...o,
                loading: load
            }));
        },
        changeMode(mode: "order" |'invoice'){
            setState(o =>({
                ...o,
                mode
            }));
            
        },
        changePattern(newPattern: string){
            setState(o =>({
                ...o,
                filters: {
                    ...o.filters,
                    pattern: newPattern
                }
            }));
        },
        changeInvoiceRef(invoiceRef: string){
            setState(o =>({
                ...o,
                filters: {
                    ...o.filters,
                    invoiceRef: invoiceRef
                }
            }));
        },
        changeOrderStatus(orderStatus: string){
            setState(o =>({
                ...o,
                filters: {
                    ...o.filters,
                    orderStatus: OrderStatus[orderStatus as keyof typeof OrderStatus]
                }
            }));
        },
        changeHasPaid(hasPaid: boolean){
            setState(o =>({
                ...o,
                filters: {
                    ...o.filters,
                    hasPaid
                }
            }));
        },
        changeDateOfOrder(dateOfOrder: string){
            setState(o =>({
                ...o,
                filters: {
                    ...o.filters,
                    dateOfOrder: OrderFilterByDate[dateOfOrder as keyof typeof OrderFilterByDate]
                }
            }));
        },
        handleSubmit(){
            this.load(true);
            switch(state.mode){
                case 'invoice':
                    this.searchInvoice(state.data.invoiceList,(newInvoiceList) =>{
                        this.filterInvoiceWithHasPaidStatus(newInvoiceList);
                        this.load(false);
                    }); 
                    return;
                case 'order':
                    if(state.filters.invoiceRef){
                        this.searchOrderListByInvoiceRef(state.data.orderList, (newOrderList) =>{
                            this.load(false);
                        });
                        return;
                    }
                    // this.searchForOrderListFromInvoice();
                    this.filterOrderListByOrderStatus(state.data.orderList, (newOrderList) =>{
                        this.searchOrderListByPattern(newOrderList, (newOrderList) =>{
                            this.searchOrderListByDateOfOrder(newOrderList);
                            this.load(false);
                        });
                    });
                    return;
            }
        },
        // 1. Invoice Data Filter And Search Actions
        searchInvoice(invoiceList: GetInvoiceResponseDTO[],callback?: (newInvoiceList: GetInvoiceResponseDTO[]) => void){
            setState(o =>{
                const newInvoiceList = invoiceList.filter(invoice =>{
                                                        const {id, bank,...others} = invoice;
                                                        return Object.entries({id: id.toString(), bank}).some(([_, value]) => {
                                                            return value.toLowerCase().includes(o.filters.pattern.toLowerCase());
                                                        });
                                                    });                             
                callback?.(newInvoiceList);
                return {
                    ...o,
                    show:{
                        ...o.show,
                        invoiceList: newInvoiceList,
                    }
                }
            });
        },
        filterInvoiceWithHasPaidStatus(invoiceData: GetInvoiceResponseDTO[], callback?: (newInvoiceList: GetInvoiceResponseDTO[]) => void){
            setState(o =>{
                const newInvoiceList = invoiceData.filter(invoice =>{
                    return invoice.hasPaid === o.filters.hasPaid;
                });

                callback?.(newInvoiceList);
                return {
                    ...o,
                    show:{
                        ...o.show,
                        invoiceList: newInvoiceList
                    }
                }
            });
        },
        // 2. Order Data Filter And Search Actions
        searchOrderListByInvoiceRef(orderData: GetOrderResponseDTO[], callback?: (newOrderData: GetOrderResponseDTO[]) => void){
            setState(o => {
                const newOrderData = orderData.filter(order =>{
                    return order.invoiceRef === o.filters.invoiceRef
                });

                callback?.(newOrderData);
                return {
                    ...o,
                    show: {
                        ...o.data,
                        orderList: newOrderData
                    }
                }
            });
        },
        searchOrderListByPattern(orderData: GetOrderResponseDTO[], callback?: (newOrderData: GetOrderResponseDTO[]) => void){
            setState(o => {
                const newOrderData = orderData.filter(order =>{
                    const {id, merchant, productName} = order;
                    return Object.entries({id: id.toString(), merchant, productName}).some(([_, value]) =>{
                        return value.includes(o.filters.pattern);
                    });
                });
                callback?.(newOrderData);
                return {
                    ...o,
                    show: {
                        ...o.data,
                        orderList: newOrderData
                    }
                }
            });
        },
        searchOrderListByDateOfOrder(orderData: GetOrderResponseDTO[], callback?: (newOrderData: GetOrderResponseDTO[]) => void){
            setState(o => {
                const newOrderData = orderData.filter(order =>{
                    console.log(moment(new Date()).diff(order.createdAt, 'days'));
                    console.log(`${OrderFilterByDate.lastWeek} === ${o.filters.dateOfOrder}`)
                    switch (o.filters.dateOfOrder) {
                        case OrderFilterByDate.today:
                            return moment(new Date()).diff(order.createdAt, 'days') === 0;
                        case OrderFilterByDate.yesterday:
                            return moment(new Date()).diff(order.createdAt, 'days') === 1;
                        case OrderFilterByDate.threeDaysAgo:
                            return moment(new Date()).diff(order.createdAt, 'days') <= 3;
                        case OrderFilterByDate.lastWeek:
                            return moment(new Date()).diff(order.createdAt, 'weeks') <= 1;
                        case OrderFilterByDate.lastMonth:
                            return moment(new Date()).diff(order.createdAt, 'months') <= 1;
                        case OrderFilterByDate.lastYear:
                            return moment(new Date()).diff(order.createdAt, 'years') <= 1;
                        default:
                            return true;
                    }
                }).sort((a,b) => moment(a.createdAt).isSameOrAfter(b.createdAt)? -1 : 1);
                callback?.(newOrderData);
                return {
                    ...o,
                    show: {
                        ...o.data,
                        orderList: newOrderData
                    }
                }
            });
        },
        filterOrderListByOrderStatus(orderData: GetOrderResponseDTO[], callback?: (newOrderData: GetOrderResponseDTO[]) => void){
            setState(o =>{
                const newOrderList = o.filters.orderStatus === undefined ? 
                orderData
                : orderData.filter(p => OrderStatus[p.orderStatus as keyof typeof OrderStatus] === o.filters.orderStatus);
                callback?.(newOrderList);
                return {
                    ...o,
                    show: {
                        ...o.show,
                        orderList: newOrderList
                    }
                }
            });
        },
        // 3. Render
        modeRender(mode: "order" | "invoice"){
            return mode === "order" && (
                <Row className="order-show__button--group py-3" xs="1" sm="2" md="3" lg="4" xl="5" xxl="6">
                    <Col className="my-1">
                        <span className="p-3 order-show__tab--text"
                            data-active={state.filters.orderStatus === undefined}
                            data-text-hover
                            onClick={() => this.changeOrderStatus("all")} 
                            data-pointer>All</span>
                    </Col>
                    {Object.values(OrderStatus).map((status,index) =>{
                        if(typeof status === 'string'){
                            return (
                            <Col key={index} className="my-1">
                                <span className="p-3 order-show__tab--text"
                                    data-active={index === state.filters.orderStatus}
                                    data-text-hover
                                    onClick={() => this.changeOrderStatus(status)} 
                                    data-pointer>{status.match(/[A-Z][a-z]+/g)?.map((word, i) => i === 0 ? word : word.toLowerCase())?.join(" ")}</span>
                            </Col>);
                        }
                    })}
                </Row>
            )
        },
        orderOrInvoiceSearchRender(mode: 'order' | 'invoice'){
            return (
                <Form>
                    {mode === 'invoice' ? (
                        <Row className="py-3" xs={1} sm={2} md={2} lg={3} xl={4}>
                            <Col className="mb-2">
                                <Form.Control 
                                    value={state.filters.pattern}
                                    name="pattern"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => functions.changePattern(e.currentTarget.value)}
                                    placeholder='Search invoice such as Id, Bank or Status'></Form.Control>
                            </Col>
                            <Col className="mb-2">
                                <Form.Select 
                                    defaultChecked={state.filters.hasPaid}
                                    name="pattern"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => functions.changeHasPaid(e.currentTarget.value === "true")}
                                    >
                                        <option value={"true"}>Completed</option>
                                        <option value={"false"}>Not Completed</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Control 
                                        value={state.filters.pattern}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => functions.changePattern(e.currentTarget.value)}
                                        placeholder='Search order such as Id, Shopper, Product name'></Form.Control>
                                </Col>
                            </Row>
                            <Row xs={1} sm={2} md={3} lg={4} xl={4}>
                                <Col className="mb-3">
                                    <Form.Control 
                                        value={state.filters.invoiceRef}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => functions.changeInvoiceRef(e.currentTarget.value)}
                                        placeholder='Search by "transaction reference"'></Form.Control>
                                </Col>
                                <Col className="mb-3">
                                    <Form.Select
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            functions.changeDateOfOrder(e.target?.value);
                                        }}>
                                        {Object.entries(OrderFilterByDate).map(([_,value], index) =>{
                                            return typeof value === 'string' && (
                                                <option key={index} value={_}>{value}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            );
        },
        orderOrInvoiceRender(mode: 'order' | 'invoice', invoiceData: GetInvoiceResponseDTO[], orderData: GetOrderResponseDTO[]){
            return (
                <>
                    {state.loading ? (
                        <Spinner animation='border'></Spinner>
                    ): mode === "invoice" ?
                        (<Row className="py-3 order-show__list"
                            xs={1} sm={2} md={2} lg={3} xl={4}>
                                {invoiceData.map((invoice,index) =>{
                                    return (
                                        <Col key={index + 1}>
                                            <InvoiceCard invoice={invoice} onClick={() => {
                                                this.changeInvoiceRef(invoice.onlineRef);
                                                this.changeMode("order");
                                            }}></InvoiceCard>
                                        </Col>)
                                })} 
                        </Row>)
                        :
                        (<Row className="py-3 order-show__list"
                            xs={1} sm={1} md={2} xl={3}>
                            {orderData.map((order,index) => {
                                return (
                                <Col xs="auto" sm="auto" key={index + 1}>
                                    <OrderCard order={order}></OrderCard>
                                </Col>)
                            })}
                        </Row>)
                    }
                </>)
        }
    };

    React.useEffect(() =>{
        axiosErrorHandler(()=>{
            paymentAPIInstance.getMyOrder(Number(userId)).then(response => {
                const {data} = response;
                if(Array.isArray(data)){
                    functions.setInvoiceList(data);
                }
            });
        })
    },[]);

    React.useEffect(() =>{
        if(timeout.current){
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() =>{
            functions.handleSubmit();
        }, 300);

        return () =>{
            timeout.current && clearTimeout(timeout.current);
        }
    }, [state.filters, state.data]);

    return (
        <section id="order-show">
            <article>
                <Row>
                    <Col>
                        <h3>{state.mode === "invoice" ? "Invoice" : "Order"} List</h3>
                        <i>Check your {state.mode === "invoice" ? "invoice" : "order"}</i>
                    </Col>
                    <Col>
                        <Row className="order-show__button--group"
                            style={{float: 'right'}}
                            xs={1} sm={2}>
                            <Col xs="auto" sm="auto">
                                <Button data-bcolor="logo" className="order-show__tab--title" onClick={() => functions.changeMode("invoice")}>Invoice</Button>
                            </Col>
                            <Col xs="auto" sm="auto">
                                <Button data-bcolor="logo" className="order-show__tab--title" onClick={() => functions.changeMode("order")}>Orders</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </article>
            
            {functions.modeRender(state.mode)}
            {functions.orderOrInvoiceSearchRender(state.mode)}
            {functions.orderOrInvoiceRender(state.mode, state.show.invoiceList.sort((a,b) => a.hasPaid ?  0 : 1), state.show.orderList)}        
        </section>
    )
}

const InvoiceCard = ({invoice, onClick}: {invoice: GetInvoiceResponseDTO, onClick: () => void}) =>{
    return (
        <article className='invoice-card__root mb-3'>
            <div className="invoice-card__container p-5 p-lg-3">
                <Row className="invoice-card__line">
                    <Col>
                        Invoice No.
                    </Col>
                    <Col>
                        <p>{invoice.id}</p>
                    </Col>
                </Row>
                
                <Row className="invoice-card__line">
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

                <Row className="invoice-card__line">
                    <Col>
                        Transaction code:
                    </Col>
                    <Col>
                        <p data-pointer title={invoice.onlineRef}>
                            {invoice.onlineRef.substring(0, 12)}...
                        </p>
                    </Col>
                </Row>

                <Row className="invoice-card__line">
                    <Col>
                        Bank:
                    </Col>
                    <Col>
                        <p>
                            {invoice.bank}
                        </p>
                    </Col>
                </Row>

                <Row className="invoice-card__line">
                    <Col>
                        Paid:
                    </Col>
                    <Col>
                        <p>
                            {invoice.hasPaid ? "Completed" : "Not yet"}
                        </p>
                    </Col>
                </Row>

                <Row className="invoice-card__line">
                    <Col>
                        Orders :
                    </Col>
                    <Col>
                        <span>
                            <b>
                                {invoice.orders.length}
                            </b>
                        </span>
                        <span className="invoice-card__order--trigger" onClick={onClick}>
                            <FaPlusSquare></FaPlusSquare>
                        </span>
                    </Col>
                </Row>
            </div>
        </article>
    )
}

const OrderCard = ({order}: {order: GetOrderResponseDTO}) =>{
    return (
        <article className="order-card__root py-2">
            <div className="order-card__container p-3">
                {/* <h4>Order Card</h4> */}
                <div className='order-card__body'>
                    <Row className="order-card__line">
                        <Col>Order Date :</Col>
                        <Col data-text-align={"right"}>{moment(order.createdAt).format("YYYY-MM-DD")}</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>Order Time :</Col>
                        <Col data-text-align={"right"}>{moment(order.createdAt).format("HH:mm:ssA")}</Col>
                    </Row>
                    <Row className="order-card__line"> 
                        <Col>Order No :</Col>
                        <Col data-text-align={"right"}>{order.id}</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>Product Name :</Col>
                        <Col data-text-align={"right"} title={order.productName}>
                            <Row>
                                <Col>
                                    <Image src={order.productImage} alt={order.productName} style={{width: "40px", height:"40px"}}></Image>
                                </Col>
                                <Col>
                                    {order.productName}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>To :</Col>
                        <Col data-text-align={"right"} title={order.address}>{order.address}</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>Amount :</Col>
                        <Col data-text-align={"right"}>{order.amount}</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>Total :</Col>
                        <Col data-text-align={"right"}>{order.price.toLocaleString("en-US", {maximumFractionDigits: 0})}</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>Transaction Ref :</Col>
                        <Col data-text-align={"right"}>{order.invoiceRef.substring(0,10)}...</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>Status :</Col>
                        <Col data-text-align={"right"}>{order.orderStatus}</Col>
                    </Row>
                    <Row className="order-card__line">
                        <Col>
                            <Button data-bcolor="logo">
                                <CustomLink to={`/orders/${order.id}/track`}>
                                    View
                                </CustomLink>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </article>)
}