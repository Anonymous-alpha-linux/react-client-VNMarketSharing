import React from 'react';
import { Col, Image, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatedTruck } from '../../components';
import { GetOrderResponseDTO, OrderStatus } from '../../models';
import "./order.css";
import { paymentAPIInstance } from '../../config';
import moment from 'moment';

export const OrderTrackerPage: React.FC<{}> = () => {
    const displayedEntries = Object
                            .entries(OrderStatus)
                            .filter(([key, value]) => Number(key) > -1 
                            && value !== OrderStatus[OrderStatus.Waiting]
                            && value !== OrderStatus[OrderStatus.CustomerNotReceived] 
                            && value !== OrderStatus[OrderStatus.SellerDenied]);
    const [activeEntry, setActiveEntry] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [order, setOrder] = React.useState<GetOrderResponseDTO>();
    const functions = {
        fetchOrder(){
            setLoading(true);
            if(params.hasOwnProperty("id")){
                const { id } = params;
                paymentAPIInstance.getOrderById(Number(id)).then(response =>{
                    if(response?.data){
                        setOrder({...response.data, orderStatus: OrderStatus[OrderStatus.Completed]});
                    }
                }).catch(error =>{
                    navigate("/account/orders");   
                }).finally(() =>{
                    setLoading(false);
                });
            }
            else{
                navigate("/account/invoice");
            }
        },
        renderOrder(){
            return loading ? 
            (<Spinner animation="border"></Spinner>) : 
            order && (
                <Row>
                    <Col xs="auto" sm="auto">
                        <h4>No</h4>
                        <p>{order.id}</p>
                    </Col>
                    <Col>
                        <h4>Product</h4>
                        <div>
                            <Image src={order.productImage} style={{width: '80px'}}></Image>
                            <span>
                                <p>{order.productName}</p>
                            </span>
                        </div>
                    </Col>
                    <Col>
                        <h4>Order at</h4>
                        <p>{moment(order.createdAt).format("hh:mm:ss a DD/MM/YYYY")}</p>
                    </Col>
                    <Col>
                        <h4>Status</h4>
                        <p>{order.orderStatus}</p>
                    </Col>
                    <Col>
                        <h4>Intended delivery time</h4>
                        <p>{moment(order.expireTime).format("DD/MM/YYYY")}</p>
                    </Col>
                    <Col>
                        <h4>Total purchase</h4>
                        <p>{order.total.toLocaleString("en-US")} VND</p>
                    </Col>
                </Row>
            )
        }
    }
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        functions.fetchOrder();
    }, []);

    React.useEffect(() => {
        if(order){
            setActiveEntry(OrderStatus[order.orderStatus as keyof typeof OrderStatus]);
        }
    }, [order]);

    return (
        <section className="p-3">
            <Row className='order-tracker__flex'>
                {displayedEntries.map(([key, value], index) =>{
                    return (<React.Fragment key={index}>
                        <Col className="order-tracker__tracker" 
                        data-completed={Number(key) <= activeEntry}
                        data-in-trunk={index < displayedEntries.length - 1}>
                            <div className="order-tracker__status">
                                {Number(key) === activeEntry && (<div className="order-tracker__icon">
                                    <AnimatedTruck></AnimatedTruck>
                                </div>)}
                            </div>
                            <span className='order-tracker__label' data-active={Number(key) === activeEntry}>
                                <span>
                                    {value.toString().match(/[A-Z][a-z]+/g)?.map((word, i) => i === 0 ? word : word.toLowerCase())?.join(" ")}
                                </span>
                            </span>
                        </Col>
                    </React.Fragment>)
                })}
            </Row>
            {functions.renderOrder()}
        </section>
    )
}