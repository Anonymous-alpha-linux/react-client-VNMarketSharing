import React from 'react';
import moment from 'moment';
import { Order } from '../../containers';
import { useTypedSelector } from '../../hooks';
import { GetOrderResponseDTO } from '../../models';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

export const OrderShow: React.FC<{}> = () => {
    const {data: {userId}} = useTypedSelector(s=>s.user);
    const [orders, setOrders] = React.useState<GetOrderResponseDTO[]>([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if(typeof location === "object" && location.state?.hasOwnProperty("from")){
            const locationState = location.state as {
                from?: string;
                orderList?: GetOrderResponseDTO[]
            }

            if(locationState.from === ("/sale/invoice") && !!locationState.orderList){
                const { orderList } = locationState;
                setOrders(orderList);
                setLoading(false);
            }
        }
        else{
            navigate({
                pathname: '/sale/invoice'
            })
        }
    },[userId]);

    if(loading) return <Container fluid>
        <Spinner animation='border'></Spinner>
    </Container>

    return (
        <section className="p-4">
            <Order.OrderTable 
                data={orders.map(order =>{
                    const {id ,buyerFullName, createdAt, expireTime, orderStatus, merchantId,merchant, addressId,description,...props} = order;
                    return {
                        "id": id,
                        "Buyer name": buyerFullName,
                        "ordered at": moment(createdAt).format("HH:mm:ss - DD/MM/YYYY"),
                        "finished at": moment(expireTime).format("HH:mm:ss - DD/MM/YYYY"),
                        "status": {
                            title: orderStatus,
                            status: "danger"
                        },
                        ...props,
                    };
                })}
                onRead={(item) =>{
                    console.log(item);
                }}
                onAccept={(item) =>{

                }}
                onDeny={(item) =>{

                }}
            ></Order.OrderTable>
        </section>
    )
}