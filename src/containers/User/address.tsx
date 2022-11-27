import axios, { AxiosError } from 'axios';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Form, Spinner, Stack, Modal, Row, Col, InputGroup, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { TbEdit } from 'react-icons/tb';
import { Formik, FormikHelpers } from 'formik';
import { addressAPIInstance, userAPIInstance } from '../../config';
import { axiosErrorHandler, useActions, useTypedSelector } from '../../hooks';
import { createAddress } from "../../schemas";
import provinceData from '../../fixture/data.json';
import { CustomLink } from '../../components';
import "./index.css";
import { BsInfoCircleFill } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';

export const Address = () => {
    const location = useLocation();

    return (
        <Row xs={1} sm={1} md={2}>
            <Col>
                <h3>Billing Address</h3>
                <Button variant='link'>
                    <span style={{color:'#000', cursor: 'pointer'}}>
                        <CustomLink to={{
                            pathname: "create",
                            hash: '#BillingAddress'
                        }} 
                        state={{ from: location, addressType: 0 }}>
                            Add A New Billing Address
                        </CustomLink>
                    </span>
                </Button>
                <AddressDetail type={"billing"}></AddressDetail>
            </Col>

            <Col>
                <h3>Shipping Address</h3>
                <Button variant='link'>
                    <span style={{color:'#000', cursor: 'pointer'}}>
                        <CustomLink to={{
                            pathname: "create",
                            hash: '#ShippingAddress'
                        }} 
                        state={{ from: location, addressType: 1 }}>
                            Add A New Shipping Address
                        </CustomLink>
                    </span>
                </Button>
                <AddressDetail type="shipping"></AddressDetail>
            </Col>
        </Row>
    )
}

type AddressModel = {
    id?: number,
    receiverName: string,
    streetAddress: string,
    district: string,
    ward: string,
    city: string,
    zipcode: string,
    isDefault: boolean,
    createdAt: Date,
    updatedAt: Date,
    phoneNumber: string,
    country: string,
    addressType?: number,
    userId: number
}
interface IBillingAddressDetailState {
    loading: boolean,
    error: string,
    data: AddressModel[]
}

const AddressDetail = (props: {type: "billing" | "shipping"}) => {
    const location = useLocation();
    const { data: { userId,addressList} } = useTypedSelector(state => state.user);
    const { getAddressList } = useActions();
    const [state, setState] = React.useState<IBillingAddressDetailState>({
        loading: false,
        error: '',
        data: []
    });
    // React.useEffect(() => {
    //     const cancelToken = axios.CancelToken.source();
    //     setState(oldState => ({
    //         ...oldState,
    //         loading: true,
    //         error: ''
    //     }));
    //     axiosErrorHandler(() =>{
    //         if (userId) {
    //             const type: number = props.type === "billing" ? 0 : 1;
    //             addressAPIInstance.getAddresses(userId, type,{
    //                 cancelToken: cancelToken.token
    //             }).then((response) => {
    //                 setState(oldState => ({
    //                     ...oldState,
    //                     loading: false,
    //                     error: '',
    //                     data: response.data
    //                 }))
    //             });
    //         }
    //     },
    //     (message: string) =>{
    //         let errorResponse = 'Failed';
    //         setState(oldState => ({
    //             ...oldState,
    //             loading: false,
    //             error: errorResponse,
    //         }));
    //     });

    //     return () =>{
    //         cancelToken.cancel();
    //     }
    // }, [userId])

    React.useEffect(() =>{
        setState(o =>({
            ...o,
            data: addressList.filter(address => {
                const identity = props.type === "billing" ? 0 : 1;
                return address.addressType === identity;
            }).map(address =>({
                ...address
            }))
        }));
    }, [addressList])

    function removeItem(addressId: any) {
        setState(o => ({
            ...o,
            data: o.data.filter(item => item.id !== addressId)
        }));
    }

    if (state.loading) return (<Container className="p-5" data-text-align="middle">
        <Spinner animation='border'>...</Spinner>
    </Container>)

    return <div>
        <Row xs={1} sm={1} xxl={2}>
            {!state.data.length
            ? <Col>
                <i>{`Add your new ${props.type === "billing" ? "billing" : "shipping"} address to obtain your wish item`}</i>
            </Col>
            : state.data.map(address => {
                return <Col key={address.id} className="mb-2">
                    <AddressCard
                        billingAddress={address} 
                        completeRemove={(addressId) => removeItem(addressId)}
                        type={props.type}></AddressCard>
                </Col>
            })}
        </Row>
    </div>
}

const AddressCard = ({ 
    billingAddress, 
    completeRemove,
    type = 'billing'
}:{ billingAddress: AddressModel,type: 'billing' | 'shipping', completeRemove?: (addressId: string) => void }) => {
    const {data: {userId}} = useTypedSelector(s => s.user);
    const {getAddressList} = useActions();
    const [state, setState] = React.useState<{ confirmDelete: boolean }>({
        confirmDelete: false
    });
    const navigate = useNavigate();
    const location = useLocation();
    const editBtnRef = React.useRef<HTMLButtonElement>(null);

    function openConfirmation() {
        setState(o => ({
            ...o,
            confirmDelete: true,
            error: ''
        }));
    }
    function closeConfirmation() {
        setState(o => ({
            ...o,
            confirmDelete: false,
            error: ''
        }));
    }
    function deleteCard(addressId: any) {
        if (addressId) {
            addressAPIInstance.removeAddress(addressId).then(() => {
                setState(o => ({
                    ...o,
                    confirmDelete: false,
                }));
                toast("The changes has been done");
                if (!!completeRemove) {
                    completeRemove(addressId);
                }
            }).catch((error: Error | AxiosError | any) => {
                let errorResponse = "Delete this item failed";
                if (error instanceof AxiosError) {
                    errorResponse = error.response?.data as string || errorResponse;
                }
                setState(o => ({
                    ...o,
                    confirmDelete: false,
                }));
                toast(errorResponse);
            });
        }
    }
    function setAsDefault(addressId?: number){
        if(addressId){
            axiosErrorHandler(() =>{
                userAPIInstance.updateAddressDefault(addressId, Number(userId), type === 'billing'? 0 : 1)
                .then(response=>{
                    getAddressList(Number(userId));
                })
            }, msg =>{
                toast.error("Failed to send request");
            });
        }
    }
    function checkIsNullInfo(infor: string): React.ReactNode | string{
        if(!infor)
            return <span className="addressCard__icon--null" 
            onClick={() => {if(editBtnRef.current) editBtnRef.current.click()}}
            title="provide this information">
                <BsInfoCircleFill></BsInfoCircleFill>
            </span>
        return infor;
    }

    return <>
        <Card className="addressCard__container">
            <Card.Body>
                <Card.Title>{type === 'billing'? "Billing": "Shipping"} address 
                    {!!billingAddress.isDefault 
                    ? <Badge bg="secondary" className="addressCard__badge--default">default</Badge>
                    : <Badge bg="success" className="addressCard__badge" onClick={() => setAsDefault(billingAddress.id)}>Set as default</Badge>}
                </Card.Title>
                <Row>
                    <Col>
                        Name :
                    </Col>
                    <Col>
                        <Card.Text>{checkIsNullInfo(billingAddress.receiverName)}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Address :
                    </Col>
                    <Col>
                        <Card.Text>{checkIsNullInfo(billingAddress.streetAddress)}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        District :
                    </Col>
                    <Col>
                        <Card.Text>{checkIsNullInfo(billingAddress.district)}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Ward :
                    </Col>
                    <Col>
                        <Card.Text>{checkIsNullInfo(billingAddress.ward)}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        City :
                    </Col>
                    <Col>
                        <Card.Text>{checkIsNullInfo(billingAddress.city)}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Country :
                    </Col>
                    <Col>
                        <Card.Subtitle>{checkIsNullInfo(billingAddress.country)}</Card.Subtitle>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Phone :
                    </Col>
                    <Col>
                        <Card.Subtitle>{checkIsNullInfo(billingAddress.phoneNumber)}</Card.Subtitle>
                    </Col>
                </Row>
                
            </Card.Body>
            <Card.Footer>
                <Row>
                    <Col sm={'auto'}>
                        <Button variant="success" 
                            className="addressCard__btn--update"
                            ref={editBtnRef}
                            onClick={() => {
                                navigate("edit", {
                                    state: { from: location, payload: billingAddress },
                                });
                        }}>
                            <TbEdit></TbEdit>
                        </Button>
                    </Col>
                    <Col sm={'auto'}>
                        <Button className="addressCard__btn--delete" variant="danger" onClick={openConfirmation}>
                            <FaTimes></FaTimes>
                        </Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
        
        {/* Delete Confirmation */}
        <Modal show={state.confirmDelete} onHide={closeConfirmation}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Modal.Title>
                    Do you want to delete this address
                </Modal.Title>
                <Form.Text>(Warn: this content cannot recover)?</Form.Text>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => {
                    deleteCard(billingAddress.id)
                }}>Confirm</Button>
                <Button variant="primary" onClick={closeConfirmation}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
}
// let VNProvincesApi = "https://provinces.open-api.vn/api/p/48?depth=3";

type BillingAddressFormState = {
    districts: {
        name: string;  
        wards: {name: string;}[]
    }[],
    initialFormValues: AddressModel
}

export const AddressCreationForm = () => {
    const { data: { userId } } = useTypedSelector(state => state.user);
    const [state, setState] = React.useState<BillingAddressFormState>({
        districts: [],
        initialFormValues: {
            createdAt: new Date(new Date().toUTCString()),
            isDefault: false,
            phoneNumber: '',
            district: '',
            ward: '',
            receiverName: '',
            streetAddress: '',
            updatedAt: new Date(new Date().toUTCString()),
            zipcode: '',
            country: 'Viet Nam',
            city:'Thanh pho Da Nang',
            userId: parseInt(userId)
        }
    });
    const navigate = useNavigate();
    const location = useLocation();

    function getVNProvincesApi() {
        setState(o =>{
            return {
                ...o,
                districts: provinceData.districts.map(d => ({
                    name: d.name,
                    wards: d.wards.map(w => ({name: w.name}))
                }))
            }
        });
    }
    function setInitialFormValues(formValues: AddressModel){
        setState(o => {
            return {
                ...o,
                initialFormValues: formValues
            }
        })
    }
    
    React.useEffect(() => {
        getVNProvincesApi();
    }, []);

    React.useEffect(() =>{
        if(location.state){
            const locationState = location.state as {
                from: Location,
                addressType: number;
                payload?: AddressModel;
            };

            setInitialFormValues({
                createdAt: new Date(new Date().toUTCString()),
                isDefault: false,
                phoneNumber: '(+84)',
                district: '',
                ward: '',
                receiverName: '',
                streetAddress: '',
                updatedAt: new Date(new Date().toUTCString()),
                zipcode: '',
                country: 'Viet Nam',
                city:'Thanh pho Da Nang',
                addressType: locationState.addressType,
                userId: parseInt(userId)
            });
        }
    }, []);

    return (
        <Formik initialValues={state.initialFormValues}
            enableReinitialize={true}
            validationSchema={createAddress}
            onSubmit={(values: AddressModel, formHelpers: FormikHelpers<AddressModel>) => {
                formHelpers.setSubmitting(false);

                addressAPIInstance.createAddress(values).then(() => {
                    navigate(-1);
                    toast.success("New item has been added successfully");
                }).catch((error: Error | AxiosError | any) => {
                    let errorStr = 'Failed';
                    if (error instanceof AxiosError) {
                        errorStr = error!.response?.data || errorStr;
                    }
                });
            }}>
            {({ values, touched, errors, handleBlur, handleChange, handleSubmit, ...props }) => {
                return <Form onSubmit={handleSubmit}>
                    <h3 data-text-align='center'>{location?.hash.toLowerCase().includes("billing") ? "Billing Address" : "Shipping Address"}</h3>
                    <Form.Group controlId='controlReceiverName'>
                        <Form.Label>Receiver Name</Form.Label>
                        <Form.Control value={values.receiverName}
                            name="receiverName" onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.receiverName && !!errors.receiverName}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.receiverName}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Country and City */}
                    <Row className="pb-3">
                        <Form.Group as={Col} controlId='controlCountry'>
                            <Form.Label>Country/Region/*...</Form.Label>
                            <Form.Control value={values.country} 
                                name="country"
                                onBlur={handleBlur}
                                onChange={handleChange} 
                                isInvalid={touched.country && !!errors.country}
                                disabled></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId='controlCity'>
                            <Form.Label>Town / City</Form.Label>
                            <Form.Control value={values.city} 
                                name="city"
                                onBlur={handleBlur}
                                onChange={handleChange} 
                                disabled
                                isInvalid={touched.city && !!errors.city}></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    {/* Ward and District */}
                    <Row className="pb-3">
                        <Form.Group as={Col} controlId='controlDistrict'>
                            <Form.Label>District</Form.Label>
                            <Form.Select value={values.district} 
                                name="district"
                                onBlur={handleBlur}
                                onChange={handleChange} isInvalid={touched.district && !!errors.district}>
                                    <option value={""} style={{opacity: 0.2, color: '#000'}}>Choose your district...</option>
                                    {state.districts.map((district,index) =>{
                                        return <option key={index + 1} value={district.name}>{district.name}</option>
                                    })}
                                </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId='controlWard' disabled={!values.district}>
                            <Form.Label>Ward</Form.Label>
                            <Form.Select value={values.ward} 
                                name="ward"
                                onBlur={handleBlur}
                                onChange={handleChange} isInvalid={touched.ward && !!errors.ward}>
                                    {state.districts.find(d => d.name === values.district)?.wards.map((w,index) =>{
                                        return <option key={index + 1} value={w.name}>{w.name}</option>
                                    })}
                                </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.ward}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Street address */}
                    <Form.Group controlId='controlStreetAddress' className="pb-3">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control value={values.streetAddress} name="streetAddress"
                            onBlur={handleBlur}
                            onChange={handleChange} isInvalid={touched.streetAddress && !!errors.streetAddress}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.streetAddress}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Zipcode and Phone */}
                    <Row className="pb-3">
                        <Form.Group as={Col} controlId='controlZip'>
                            <Form.Label>Postcode / ZIP (optional)</Form.Label>
                            <Form.Control value={values.zipcode} name="zipcode"
                                onBlur={handleBlur}
                                onChange={handleChange} isInvalid={touched.zipcode && !!errors.zipcode}></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId='controlPhone'>
                            <Form.Label>Phone</Form.Label>
                            <InputGroup>
                                <InputGroup.Text id="phone-addon">
                                (+84)
                                </InputGroup.Text>
                                <Form.Control type="phone" 
                                    value={!values.phoneNumber && !values.phoneNumber.startsWith("(+84)") ? `(+84)` : values.phoneNumber }
                                    name="phoneNumber"
                                    aria-describedby={'phone-addon'}
                                    onBlur={handleBlur}
                                    onChange={handleChange} 
                                    isInvalid={touched.phoneNumber && !!errors.phoneNumber}></Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Button type="submit" style={{margin: "1.2rem 0", fontWeight:"700"}}>Send</Button>
                </Form>
            }}
        </Formik>
    )
}

export const AddressUpdateForm = () => {
    const { data: { userId } } = useTypedSelector(state => state.user);
    const [state, setState] = React.useState<BillingAddressFormState>({
        districts: [],
        initialFormValues: {
            createdAt: new Date(new Date().toUTCString()),
            isDefault: false,
            phoneNumber: '',
            district: '',
            ward: '',
            receiverName: '',
            streetAddress: '',
            updatedAt: new Date(new Date().toUTCString()),
            zipcode: '',
            country: 'Viet Nam',
            city:'Thanh pho Da Nang',
            userId: parseInt(userId)
        }
    });
    const navigate = useNavigate();
    const location = useLocation();

    function getVNProvincesApi() {
        setState(o =>{
            return {
                ...o,
                districts: provinceData.districts.map(d => ({
                    name: d.name,
                    wards: d.wards.map(w => ({name: w.name}))
                }))
            }
        });
    }
    function setInitialFormValues(formValues: AddressModel){
        setState(o => {
            return {
                ...o,
                initialFormValues: formValues
            }
        })
    }
    
    React.useEffect(() => {
        getVNProvincesApi();
    }, []);
    React.useEffect(() =>{
        if(location.state){
            const locationState = location.state as {
                from: Location,
                addressType: number;
                payload?: AddressModel;
            };

            setInitialFormValues({
                createdAt: new Date(new Date().toUTCString()),
                isDefault: false,
                phoneNumber: '(+84)',
                district: '',
                ward: '',
                receiverName: '',
                streetAddress: '',
                updatedAt: new Date(new Date().toUTCString()),
                zipcode: '',
                country: 'Viet Nam',
                city:'Thanh pho Da Nang',
                addressType: locationState.addressType,
                userId: parseInt(userId)
            });
        }
    }, []);

    return (
        <Formik initialValues={state.initialFormValues}
            enableReinitialize={true}
            validationSchema={createAddress}
            onSubmit={(values: AddressModel, formHelpers: FormikHelpers<AddressModel>) => {
                if (location.pathname.match(/edit$/i) && values?.id) {
                    addressAPIInstance.updateAddress(values, values.id.toString()).then(() => {
                        navigate(-1);
                        toast.success("The item has been updated");
                    }).catch((error: Error | AxiosError | any) => {
                        let errorResponse = "Delete this item failed";
                        if (error instanceof AxiosError) {
                            errorResponse = error.response?.data as string || errorResponse;
                        }
                        toast.error(errorResponse);
                    });
                }
                else {
                    addressAPIInstance.createAddress(values).then(() => {
                        navigate(-1);
                        toast("New item has been added successfully");
                    }).catch((error: Error | AxiosError | any) => {
                        let errorStr = 'Failed';
                        if (error instanceof AxiosError) {
                            errorStr = error!.response?.data || errorStr;
                        }
                    });
                }

                formHelpers.setSubmitting(false);
            }}>
            {({ values, touched, errors, handleBlur, handleChange, handleSubmit, ...props }) => {
                return <Form onSubmit={handleSubmit}>
                    <h4>{values.addressType === 0 ? "Billing Address" : " Shipping Address"}</h4>
                    <Form.Group controlId='controlReceiverName'>
                        <Form.Label>Receiver Name</Form.Label>
                        <Form.Control value={values.receiverName}
                            name="receiverName" onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.receiverName && !!errors.receiverName}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.receiverName}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Country and City */}
                    <Row>
                        <Form.Group as={Col} controlId='controlCountry'>
                            <Form.Label>Country/Region/*...</Form.Label>
                            <Form.Control value={values.country} 
                                name="country"
                                onBlur={handleBlur}
                                onChange={handleChange} 
                                isInvalid={touched.country && !!errors.country}
                                disabled></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId='controlCity'>
                            <Form.Label>Town / City</Form.Label>
                            <Form.Control value={"Thanh pho Da nang"} 
                                name="city"
                                onBlur={handleBlur}
                                onChange={handleChange} 
                                disabled
                                isInvalid={touched.city && !!errors.city}></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    {/* Ward and District */}
                    <Row>
                        <Form.Group as={Col} controlId='controlDistrict'>
                            <Form.Label>District</Form.Label>
                            <Form.Select value={values.district} 
                                name="district"
                                onBlur={handleBlur}
                                onChange={handleChange} isInvalid={touched.district && !!errors.district}>
                                    <option value={""} style={{opacity: 0.2, color: '#000'}}>Choose your district...</option>
                                    {state.districts.map((district,index) =>{
                                        return <option key={index + 1} value={district.name}>{district.name}</option>
                                    })}
                                </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId='controlWard' disabled={!values.district}>
                            <Form.Label>Ward</Form.Label>
                            <Form.Select value={values.ward} 
                                name="ward"
                                onBlur={handleBlur}
                                onChange={handleChange} isInvalid={touched.ward && !!errors.ward}>
                                    {state.districts.find(d => d.name === values.district)?.wards.map((w,index) =>{
                                        return <option key={index + 1} value={w.name}>{w.name}</option>
                                    })}
                                </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.ward}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Street address */}
                    <Form.Group controlId='controlStreetAddress'>
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control value={values.streetAddress} name="streetAddress"
                            onBlur={handleBlur}
                            onChange={handleChange} isInvalid={touched.streetAddress && !!errors.streetAddress}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.streetAddress}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Zipcode and Phone */}
                    <Row>
                        <Form.Group as={Col} controlId='controlZip'>
                            <Form.Label>Postcode / ZIP (optional)</Form.Label>
                            <Form.Control value={values.zipcode} name="zipcode"
                                onBlur={handleBlur}
                                onChange={handleChange} isInvalid={touched.zipcode && !!errors.zipcode}></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId='controlPhone'>
                            <Form.Label>Phone</Form.Label>
                            <InputGroup>
                                <InputGroup.Text id="phone-addon">
                                (+84)
                                </InputGroup.Text>
                                <Form.Control type="phone" value={!values.phoneNumber && !values.phoneNumber.startsWith("(+84)") ? `(+84)` : values.phoneNumber }
                                    name="phoneNumber"
                                    aria-describedby={'phone-addon'}
                                    onBlur={handleBlur}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                        handleChange(e);
                                    }} isInvalid={touched.phoneNumber && !!errors.phoneNumber}></Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Button type="submit" style={{margin: "1.2rem 0", fontWeight:"700"}}>Send</Button>
                </Form>
            }}
        </Formik>
    )
}