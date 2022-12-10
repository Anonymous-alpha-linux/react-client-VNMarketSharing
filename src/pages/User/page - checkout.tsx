import React from 'react';
import axios from 'axios';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { TiTimes } from 'react-icons/ti';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Formik, FormikErrors, FormikTouched } from 'formik';
import {paymentAPIInstance, addressAPIInstance} from '../../config';
import { axiosErrorHandler, useActions, useTypedSelector } from '../../hooks';
import { CustomLink, Input } from '../../components';
import { GetAddressResponseDTO, GetInvoiceResponseDTO, InvoiceCreationDTO, OrderCreationDTO, PaymentCreationDTO } from '../../models';
import { invoiceCreationSchema } from '../../schemas';

export const CheckoutPage: React.FC<{}> = () => {
    const {data: {itemList}} = useTypedSelector(s => s.cart);
    const {data: {addressList}} = useTypedSelector(s => s.user);
    const {modifyItemCart, removeItemFromCart}  = useActions();

    return (<>
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
                <article style={{background: "#fff"}}>
                    <table style={{width: '100%'}}>
                        <tr>
                            <th className="p-2">
                                <input type="checkbox" defaultChecked={false}></input>
                            </th>
                            <th className='p-2'>ITEM</th>
                            <th className='p-2'>PRICE</th>
                            <th className='p-2'>QUANTITY</th>
                            <th className='p-2'>TOTAL</th>
                        </tr>
                        {
                            itemList.map(({detailIndexes,...cartItem},index) =>{
                                return <tr key={index + 1}>
                                    <td className="p-2">
                                        <input type={"checkbox"} defaultChecked={cartItem.checked}></input>
                                    </td>
                                    <td className='py-2'>
                                        <Row xs={2} sm={2}>
                                            <Col sm="4" md="3">
                                                <div style={{background: `url(${cartItem.image}) center / 100% no-repeat, #fff`, width: '120px', height: '120px', margin: '0 auto'}}>
                                                </div>
                                            </Col>
                                            <Col sm="8">
                                                <h4>{cartItem.item.name}</h4>
                                                <div>
                                                    <label>Receiver :</label>
                                                    <p>{addressList.find(a => a.id === cartItem.addressId)!.receiverName}</p>
                                                    <label>Address :</label>
                                                    <p>
                                                        <i>
                                                            {`${addressList.find(a => a.id === cartItem.addressId)!.streetAddress} - ${addressList.find(a => a.id === cartItem.addressId)!.ward} - ${addressList.find(a => a.id === cartItem.addressId)!.district} - ${addressList.find(a => a.id === cartItem.addressId)!.city}`}
                                                        </i>
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </td>
                                    <td className="p-2">
                                        <i>{cartItem.item?.productDetails?.find(p => detailIndexes?.[0] && detailIndexes?.[1] && p.productClassifyKeyId === detailIndexes?.[0] && p.productClassifyValueId === detailIndexes?.[1])?.price.toLocaleString("en-US") 
                                        || cartItem.item?.productDetails?.find(p => detailIndexes?.[0] && p.productClassifyKeyId === detailIndexes?.[0])?.price.toLocaleString("en-US")
                                        || cartItem.price.toLocaleString("en-US")}</i>
                                    </td>
                                    <td className="p-2">
                                        <Input.NumberInput 
                                            value={cartItem.quantity} 
                                            min={1} 
                                            max={12000} 
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                                if(e.target.valueAsNumber){
                                                    modifyItemCart(index ,cartItem.productId, e.target.valueAsNumber, cartItem.addressId);
                                                }
                                            }}
                                            ></Input.NumberInput>
                                    </td>
                                    <td className="p-2">
                                        {cartItem.total.toLocaleString("en-US")}
                                    </td>
                                    <td className="p-2">
                                        <span style={{color:'red'}} onClick={() => removeItemFromCart(index)}>
                                            <TiTimes></TiTimes>
                                        </span>
                                    </td>
                                </tr>
                            })
                        }
                        <tr>
                            <td></td>
                            <td colSpan={4} className="p-3" style={{}}>
                                <CustomLink to={{pathname: '/'}}>
                                    <Button style={{background: 'var(--clr-logo)'}}>Buy More</Button>
                                </CustomLink>
                            </td>
                        </tr>
                    </table>
                </article>

                <article className="px-3 py-2" style={{overflow: 'auto'}}>
                    <CartInvoice></CartInvoice>
                </article>
            </Container>
        </section>
    </>
    )
}   

type CartInvoiceState = {
    addressOptions: { name:string, receiverName: string, value: number | string, isSelected: boolean }[],
    grandTotal: number;
    bankCodeList: string[];
    bankCode?: string;
    loading: boolean;
    initialFormValues: InvoiceCreationDTO;
}

const CartInvoice: React.FC<{}> = () =>{
    const {data: { totalPrice, itemList }} = useTypedSelector(s => s.cart);
    const {data: { userId, username }} = useTypedSelector(s => s.user);
    const [state, setState] = React.useState<CartInvoiceState>({
        addressOptions: [],
        bankCodeList: [],
        grandTotal: totalPrice,
        loading: false,
        initialFormValues: {
            orders: itemList.map(cartItem =>({
                buyerFullName: username,
                amount: cartItem.quantity,
                buyerId: Number(userId),
                merchantId: cartItem.item.userPage.id,
                total: cartItem.total,
                description: "Paid for Adsamrketingsharing application",
                productImage: cartItem.image,
                price: cartItem.price,
                productId: cartItem.productId,
                addressId: cartItem.addressId,
                createdAt: moment(new Date()).locale('vn').format("YYYY/MM/DD HH:mm:ss"),
                expireTime: moment(new Date()).locale('vn').add(1, "day").format("YYYY/MM/DD HH:mm:ss"),
            })) as OrderCreationDTO[],
            shipping: 'online',
            cashAmount: totalPrice,
            userId: Number(userId)
        }
    });
    const functions = {
        setAddressList(addressList: GetAddressResponseDTO[]){
            setState(o => {
                return {
                    ...o,
                    addressOptions: addressList.map(add => ({
                        name: `${add.streetAddress} - ${add.ward} - ${add.district} - ${add.city}`,
                        receiverName: `${add.receiverName}`,
                        value: add.id || 0,
                        isSelected: add.isDefault
                    }))
                }
            })
        },
        setCodeList(codeList: string[]){
            setState(o =>{
                return {
                    ...o,
                    bankCodeList: codeList
                }
            });
        },
        loadingOn(){
            setState(o =>({
                ...o,
                loading: true
            }))
        },
        loadingOff(){
            setState(o =>({
                ...o,
                loading: false
            }))
        },
        checkout(newInvoice: InvoiceCreationDTO) {
            functions.loadingOn();
            axiosErrorHandler(() =>{
                paymentAPIInstance.createInvoice(newInvoice,"/checkout/status").then(response => {
                    if(response.data?.checkoutUrl){
                        const { checkoutUrl } = response.data;
                        window.location.replace(checkoutUrl as string);
                    }
                    functions.loadingOff();
                });
            }, (msg) =>{
                functions.loadingOff();
            });
        }
    }

    React.useEffect(() =>{
        setState(o =>{
            return {
                ...o,
                grandTotal: totalPrice,
                initialFormValues: {
                    ...o.initialFormValues,
                    orders: itemList.map(cartItem =>({
                        productImage: cartItem.image,
                        buyerFullName: username,
                        amount: cartItem.quantity,
                        price: cartItem.price,
                        total: cartItem.total,
                        buyerId: Number(userId),
                        merchantId: cartItem.item.userPage.id,
                        description: "Paid for Adsamrketingsharing application",
                        addressId: cartItem.addressId,
                        productId: cartItem.productId,
                        createdAt: moment(new Date()).locale('vn').format("YYYY/MM/DD HH:mm:ss"),
                        expireTime: moment(new Date()).locale('vn').add(1, "day").format("YYYY/MM/DD HH:mm:ss"),
                    })) as OrderCreationDTO[],
                    shipping: 'online',
                    cashAmount: totalPrice
                }
            }
        }); 
    }, [totalPrice, itemList]);

    React.useEffect(() =>{
        if(userId){
            functions.loadingOn();
            Promise.all([paymentAPIInstance.getBankList(), addressAPIInstance.getAddresses(userId,1)])
                .then(response =>{
                    const {data} = response[0];
                    const {data: data2 } = response[1]; 
                    if(Array.isArray(data) && typeof data?.at(0) === 'string'){
                        functions.setCodeList(data);
                    }
                    if(Array.isArray(data2)){
                        functions.setAddressList(data2)
                    }
                    else{
                        toast.error("Format of response is not correct")
                    }
                    functions.loadingOff();
                }).catch(error =>{
                    toast.error(error.response);
                    functions.loadingOff();
                }).finally(() =>{
                    functions.loadingOff();
                });
        }
    },[userId]);

    if(state.loading) 
        return (<Container className="p-5">
            <Spinner animation='border'></Spinner>
        </Container>)

    return <Formik initialValues={state.initialFormValues}
                enableReinitialize={true}
                validationSchema={invoiceCreationSchema}
                onSubmit={(values, formikHelpers)=>{
                    formikHelpers.setSubmitting(false);
                    if(values.payment){
                        values = {...values, payment: {...values.payment, userId: Number(userId)}}
                    }
                    functions.checkout({...values});
        }}>
        {
            ({values, errors,touched ,handleChange, setFieldValue,handleSubmit}) =>{
                return <div className="px-4 py-4" style={{width: '460px', float: 'right', background: '#fff', boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}}>
                    <Form onSubmit={handleSubmit}>
                    {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
                        <Row className="py-2">
                            <Col>Subtotal:</Col>
                            <Col style={{textAlign: 'right'}}>
                                {totalPrice.toLocaleString('en-US', {minimumFractionDigits: 0})}
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>Shipping:</Col>
                            <Col style={{textAlign: 'right'}}>
                                <Form.Select name="shipping" defaultValue={values.shipping} onChange={handleChange}>
                                    <option value="online">Online payment</option>
                                    <option value="direct">Checkout as received</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>Address:</Col>
                            <Col style={{textAlign: 'right'}}>
                                <Form.Select name="addressId">
                                    <option value=""></option>
                                    {state.addressOptions.map(option => <option 
                                        value={option.value} 
                                        selected={option.isSelected}>
                                            <i>{option.receiverName}</i>
                                            {" - "}
                                            <p>{option.name}</p>
                                    </option>)}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>Coupon Code:</Col>
                            <Col style={{textAlign: 'right'}}>
                                <Form.Select name="coupon">
                                    <option value=""></option>
                                    <option value="coupon 20%">Discount 20%</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>Gift:</Col>
                            <Col style={{textAlign: 'right'}}>
                                <i>No gift</i>
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>Grand total:</Col>
                            <Col>
                                {!!errors.cashAmount}
                                <Form.Control style={{textAlign: 'right'}} 
                                    name="cashAmount" 
                                    value={values.cashAmount.toLocaleString("en-US", {minimumFractionDigits: 0})} 
                                    disabled
                                    isInvalid={!!errors.cashAmount}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    <CustomLink to={{pathname: '/'}}>Buy more</CustomLink>
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        {
                            values.shipping === "online" &&
                            <Row className="py-2">
                                <Col>Bank</Col>
                                <Col>
                                    <Form.Select name="payment.bankCode" 
                                        isInvalid={!!touched?.payment 
                                            && (touched.payment as FormikTouched<PaymentCreationDTO>)?.bankCode 
                                            && !!errors?.payment
                                            && !!(errors.payment as FormikErrors<PaymentCreationDTO>)?.bankCode}
                                        onChange={handleChange}>
                                        <option value="">Choose bank</option>
                                        {state.bankCodeList.map(bank => <option value={bank}>{bank}</option>)}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{(errors?.payment as FormikErrors<PaymentCreationDTO>)?.bankCode}</Form.Control.Feedback>
                                </Col>
                            </Row>
                        }
                        <Button className="bg-dark" type={"submit"}>
                            Proceed to checkout
                        </Button>
                    </Form>
                </div>
            }
        }
    </Formik>
}

type CheckoutSuccessPageState = {
    loading: boolean;
    error: string;
    status: "not response" | "success" | "failed";
    data: GetInvoiceResponseDTO | null;
}

export const CheckoutSuccessPage: React.FC<{}> = () =>{
    const location = useLocation();
    const cancelToken = axios.CancelToken.source();
    const [state, setState ] = React.useState<CheckoutSuccessPageState>({
        loading: false,
        error: '',
        status: 'not response',
        data: null
    }); 

    React.useEffect(() => {
        if(location.search){
            setState(o => {
                return {
                    ...o,
                    loading: true,
                    error: ''
                }
            })
            axiosErrorHandler(() =>{
                paymentAPIInstance.confirmInvoice(location.search, {
                    cancelToken: cancelToken.token,
                }).then(response =>{
                    const {data} = response;
                    if(data.invoice){
                        const {invoice} = data;
                        setState(o =>({
                            ...o,
                            data: invoice,
                            loading: false,
                            status: "success"
                        }));
                    }
                });
            },msg=>{
                setState(o => {
                    return {
                        ...o,
                        loading: false,
                        status: "failed"
                    }
                })  
            });
        }

        return () =>{
            cancelToken.cancel();
        }
    },[location]);
    
    if(state.status === "failed") return <h3>Failed to payment</h3>

    return (<section>
        <Container>
            <h3 className="py-3">Success Payment</h3>
            <article className="p-3 mb-5" style={{border: '1px solid white', background: "#fff", boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"}}>
                <div className="py-2">
                    <Row>
                        <Col>Transaction No :</Col> <Col>{state.data?.id}</Col>
                    </Row>
                    <Row>
                        <Col>Transaction code :</Col> <Col>{state.data?.onlineRef}</Col>
                    </Row>
                    <Row>
                        <Col>Paid:</Col> <Col>{state.data?.hasPaid.toString()}</Col>
                    </Row>
                    <Row>
                        <Col>Transaction time :</Col> <Col>{moment(state.data?.createdAt).format("HH:mm:ss yyyy/MM/DD")}</Col>
                    </Row>
                    <Row>
                        <Col>Shipping :</Col> <Col>{state.data?.shipping === 0 ? "Online payment" : "Pay as received"}</Col>
                    </Row>
                    <Row>
                        <Col>Orders :</Col> 
                        <Col>
                            {state.data?.orders?.length}
                        </Col>
                    </Row>
                </div>
                {state.data?.orders.map((order,index) =>{
                        return <div key={index} className="py-2" style={{borderTop: "1px solid #f1f1f1"}}>
                            <Row>
                                <Col>Order No:</Col><Col>{order.id}</Col>
                            </Row>
                            <Row>
                                <Col>Product name:</Col><Col>{order.productName}</Col>
                            </Row>
                            <Row>
                                <Col>Receiver name:</Col><Col>{order.buyerFullName}</Col>
                            </Row>
                            <Row>
                                <Col>Transaction code:</Col><Col>{order.invoiceRef}</Col>
                            </Row>
                            <Row>
                                <Col>Address:</Col><Col>{order.address}</Col>
                            </Row>
                        </div>
                })}
            </article>
        </Container>
    </section>)
}

export const StepFormPage: React.FC<{}> = () => {
    return <>
        <section>
            <header>
                <div className="step-form__steps">
                    <div>Step 1</div>
                    <div>Step 2</div>
                    <div>Step 3</div>
                    <div>Step 4</div>
                </div>
            </header>
            <article></article>
        </section>
    </>
}