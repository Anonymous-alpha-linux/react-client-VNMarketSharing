import React from 'react';
import moment from 'moment';
import { Order } from '../../containers';
import { useTypedSelector } from '../../hooks';
import { GetInvoiceResponseDTO } from '../../models';
import { paymentAPIInstance } from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

export const InvoiceShow = () => {
    const {data: {userId}} = useTypedSelector(s=>s.user);
    const [invoices, setInvoices] = React.useState<GetInvoiceResponseDTO[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if(userId){
            paymentAPIInstance.getMyOrder(Number(userId)).then(response =>{
                const {data} = response;
                if(Array.isArray(data)){
                    setInvoices(data);
                }
            })
        }
    },[userId]);

    return (
        <section className="p-4">
            <Order.InvoiceTable 
                data={invoices.map(invoice =>{
                    const {orders,cashAmount,hasPaid,createdAt,onlineRef,...props} = invoice;
                    return {
                        ...props,
                        "paid": hasPaid,
                        "time of transaction" : moment(createdAt).format("HH:mm:ss-DD/MM/YYYY"),
                        "amount": cashAmount.toLocaleString("en-US", {
                            maximumFractionDigits: 0
                        }) + "VND",
                        "transaction no": onlineRef,
                    };
                })}
                onRead={(item) =>{
                    navigate({
                        pathname: `${item.id}`,
                    }, {
                        replace: true,
                        state: {
                            from: location.pathname,
                            orderList: invoices.find(p => p.id === item.id)?.orders
                        }
                    });
                }}
            ></Order.InvoiceTable>
        </section>
    )
}