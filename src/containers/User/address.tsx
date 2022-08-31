import { AxiosError } from 'axios';
import React from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import {Badge, Button, Card, Form, Spinner, Stack,Modal} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {Formik, FormikHelpers} from 'formik';
import {addressAPIInstance} from '../../config';
import { useTypedSelector } from '../../hooks';
import { createAddress } from "../../schemas";

export const Address = () => {
    const location = useLocation();

    return (
        <Stack direction='horizontal' className='align-items-start justify-content-between' gap={3}>
            <div>
                <h1>Billing Address</h1>
                <Button variant='link'>
                    <Link to="create" state={{from: location, addressType: 0}}>Add A New Billing Address</Link>
                </Button>
                <BillingAddressDetail></BillingAddressDetail>
            </div>

            <div>
                <h1>Shipping Address</h1>
                <Button variant='link'>
                    <Link to="create" state={{from: location, addressType: 1}}>Add A New Shipping Address</Link>
                </Button>
                <ShippingAddressDetail></ShippingAddressDetail>
            </div>
        </Stack>
    )
}
type AddressModel = {
    id?: number,
    receiverName: string,
    streetAddress: string,
    province?: string,
    city: string,
    zipcode: string,
    isDefault: boolean,
    createdAt: Date,
    updatedAt: Date,
    phoneNumber: string,
    country: string,
    userId: number
}




const BillingAddressDetail = () => {
    interface IBillingAddressDetailState{
        loading: boolean, 
        error: string,
        data: AddressModel[]
    }
    const {data: {userId}} = useTypedSelector(state => state.user);
    const [state, setState] = React.useState<IBillingAddressDetailState>({
        loading: false,
        error: '',
        data: []
    });

    React.useEffect(() =>{
        setState(oldState => ({
            ...oldState,
            loading: true,
            error: ''
        }))
        try {
            if(userId){
                addressAPIInstance.getAddresses(userId,0).then((response) =>{
                    setState(oldState =>({
                        ...oldState,
                        loading: false,
                        error: '',
                        data: response.data
                    }))
                });
            }
        } catch (error: Error | AxiosError | any) {
            let errorResponse = 'Failed';
            if(error instanceof AxiosError){
                errorResponse = error!.response?.data || errorResponse;
            }
            setState(oldState => ({
                ...oldState,
                loading: false,
                error: errorResponse,
            }));
        }
    },[userId])

    function removeItem(addressId: any){
        setState(o =>({
            ...o,
            data: o.data.filter(item => item.id !== addressId)
        }));
    }

    if(state.loading) return <Spinner animation='border'>...</Spinner>
    
    return <div>
        {!state.data.length 
        && <i>Add your new shipping address to obtain your wish item</i> 
        ||  state.data.map(address => {
            return <BillingAddressCard key={address.id} billingAddress={address} completeRemove={(addressId)=>removeItem(addressId)}></BillingAddressCard>
        })}
    </div>
}
const BillingAddressCard = ({billingAddress, completeRemove}:{billingAddress: AddressModel, completeRemove?: (addressId: string) => void}) =>{
    const [state, setState] = React.useState<{confirmDelete: boolean}>({
        confirmDelete: false
    });
    const navigate = useNavigate();
    const location = useLocation();

    function openConfirmation(){
        setState(o => ({
            ...o,
            confirmDelete: true,
            error: ''
        }));
    }
    function closeConfirmation(){
        setState(o => ({
            ...o,
            confirmDelete: false,
            error: ''
        }));
    }
    function deleteCard(addressId: any){
        if(addressId){
            addressAPIInstance.removeAddress(addressId).then(()=>{
                setState(o =>({
                    ...o,
                    confirmDelete: false,
                }));
                toast("The changes has been done");
                if(!!completeRemove){
                    completeRemove(addressId);
                }
            }).catch((error: Error | AxiosError | any) =>{
                let errorResponse = "Delete this item failed";
                if(error instanceof AxiosError){
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

    return <>
        <Card style={{width: "300px"}}>
            <Card.Body>
                <Card.Title>Billing address {!!billingAddress.isDefault && <Badge bg="secondary">default</Badge>}</Card.Title>
                <Card.Text>{billingAddress.receiverName}</Card.Text>
                <Card.Text>{billingAddress.streetAddress}</Card.Text>
                <Card.Text>{billingAddress.province}
                </Card.Text>
                <Card.Text>{billingAddress.city} </Card.Text>
                <Card.Subtitle>{billingAddress.country}</Card.Subtitle>

                <Card.Subtitle>Phone: {billingAddress.phoneNumber}</Card.Subtitle>
                <Card.Footer>
                    <Button variant="success" onClick={() =>{
                        navigate("edit",{
                            state: {from:location, payload: billingAddress},
                        });
                    }}>Edit</Button>
                    <Button variant="danger" onClick={openConfirmation}>Delete</Button>
                </Card.Footer>
            </Card.Body>
        </Card>

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
const VNProvincesApi = "https://provinces.open-api.vn/api/p/48?depth=3";
type BillingAddressFormState = {
    data?: {
        name: string;
        districts?: {
            name: string;
            code: number;
            division_type: string;              
            codename: string;
            province_code: number;
            wards?: {
                name: string;
                code: number;
                division_type: string;
                codename: string;
                strict_code: 490                          
            }[];
        }[];
    }
}
export const BillingAddressForm = () =>{
    const {data: {userId}} = useTypedSelector(state => state.user);
    const [state,setState] = React.useState<BillingAddressFormState>();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as {
        from : Location,
        addressType: number;
        payload?: AddressModel
    }
    
    let initialValue = locationState?.payload || {
            city: '',
            createdAt: new Date(new Date().toUTCString()),
            isDefault: false,
            phoneNumber: '',
            province: '',
            receiverName: '',
            streetAddress: '',
            updatedAt: new Date(new Date().toUTCString()),
            zipcode: '',
            country: '',
            addressType: locationState.addressType,
            userId: parseInt(userId)
    }


    
    return (
        <Formik initialValues={initialValue}
        validationSchema={createAddress}
        onSubmit={(values:AddressModel, formHelpers:FormikHelpers<AddressModel>) => {
            if(location.pathname.match(/edit$/i) && !!locationState?.payload?.id){
                const addressId = locationState.payload.id;
                addressAPIInstance.updateAddress(values,addressId.toString()).then(() =>{
                    navigate(-1);
                    toast("The item has been updated");
                }).catch((error: Error | AxiosError | any) =>{
                    let errorResponse = "Delete this item failed";
                    if(error instanceof AxiosError){
                        errorResponse = error.response?.data as string || errorResponse;
                    }
                    toast(errorResponse);
                });
            }
            else{
                addressAPIInstance.createAddress(values).then(()=>{
                    navigate(-1);
                    toast("New item has been added successfully");
                }).catch((error: Error | AxiosError | any) =>{
                    let errorStr = 'Failed';
                    if(error instanceof AxiosError){
                        errorStr = error!.response?.data || errorStr;
                    }
                });
            }

            formHelpers.setSubmitting(false);
        }}>
            {({values,touched,errors,handleBlur,handleChange,handleSubmit}) =>{
                return <Form onSubmit={handleSubmit}>
                    <h1>Billing address</h1>
                    <Form.Group controlId='controlReceiverName'>
                        <Form.Label>Receiver Name</Form.Label>
                        <Form.Control value={values.receiverName} 
                        name="receiverName" onChange={handleChange} 
                        onBlur={handleBlur}
                        isInvalid={touched.receiverName && !!errors.receiverName}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.receiverName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlCountry'>
                        <Form.Label>Country/Region/*...</Form.Label>
                        <Form.Control value={values.country} name="country" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.country && !!errors.country}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlProvince'>
                        <Form.Label>Province (optional)</Form.Label>
                        <Form.Control value={values.province} name="province" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.province && !!errors.province}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlStreetAddress'>
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control value={values.streetAddress} name="streetAddress" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.streetAddress && !!errors.streetAddress}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.streetAddress}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlZipcode'>
                        <Form.Label>Postcode / ZIP (optional)</Form.Label>
                        <Form.Control value={values.zipcode} name="zipcode" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.zipcode && !!errors.zipcode}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlZipcode'>
                        <Form.Label>Town / City</Form.Label>
                        <Form.Control value={values.city} name="city" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.city && !!errors.city}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlPhone'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="phone" value={values.phoneNumber} 
                        name="phoneNumber" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.phoneNumber && !!errors.phoneNumber}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Apply</Button>
                </Form>
            }}
        </Formik>
    )
}



const ShippingAddressDetail = () =>{
    interface IShippingAddressDetailState{
        loading: boolean, 
        error: string,
        data: AddressModel[]
    }
    const {data: {userId}} = useTypedSelector(state => state.user);
    const [state, setState] = React.useState<IShippingAddressDetailState>({
        loading: false,
        error: '',
        data: []
    });

    React.useEffect(() =>{
        setState(oldState => ({
            ...oldState,
            loading: true,
            error: ''
        }))
        try {
            if(userId){
                addressAPIInstance.getAddresses(userId,1).then((response) =>{
                    setState(oldState =>({
                        ...oldState,
                        loading: false,
                        error: '',
                        data: response.data
                    }))
                });
            }
        } catch (error: Error | AxiosError | any) {
            let errorResponse = 'Failed';
            if(error instanceof AxiosError){
                errorResponse = error!.response?.data || errorResponse;
            }
            setState(oldState => ({
                ...oldState,
                loading: false,
                error: errorResponse,
            }));
        }
    },[userId])

    function removeItem(addressId: any){
        setState(o =>({
            ...o,
            data: o.data.filter(item => item.id !== addressId)
        }));
    }

    if(state.loading) return <Spinner animation='border'>...</Spinner>
    
    return <div>
        {!state.data.length 
        && <i>Add your new shipping address to obtain your wish item</i> 
        || state.data.map(address => {
            return <ShippingAddressCard key={address.id} shippingAddress={address} completeRemove={(addressId)=>removeItem(addressId)}></ShippingAddressCard>
        })}
    </div>
}
const ShippingAddressCard = ({shippingAddress, completeRemove}: {shippingAddress: AddressModel, completeRemove?: (addressId: string) => void}) =>{
     const [state, setState] = React.useState<{confirmDelete: boolean}>({
        confirmDelete: false
    });
    const navigate = useNavigate();
    const location = useLocation();

    function openConfirmation(){
        setState(o => ({
            ...o,
            confirmDelete: true,
            error: ''
        }));
    }
    function closeConfirmation(){
        setState(o => ({
            ...o,
            confirmDelete: false,
            error: ''
        }));
    }
    function deleteCard(addressId: any){
        if(addressId){
            addressAPIInstance.removeAddress(addressId).then(()=>{
                setState(o =>({
                    ...o,
                    confirmDelete: false,
                }));
                toast("The changes has been done");
                if(!!completeRemove){
                    completeRemove(addressId);
                }
            }).catch((error: Error | AxiosError | any) =>{
                let errorResponse = "Delete this item failed";
                if(error instanceof AxiosError){
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

    return <>
        <Card style={{width: "300px"}}>
            <Card.Body>
                <Card.Title>Billing address {!!shippingAddress.isDefault && <Badge bg="secondary">default</Badge>}</Card.Title>
                <Card.Text>{shippingAddress.receiverName}</Card.Text>
                <Card.Text>{shippingAddress.streetAddress}</Card.Text>
                <Card.Text>{shippingAddress.province}
                </Card.Text>
                <Card.Text>{shippingAddress.city} </Card.Text>
                <Card.Subtitle>{shippingAddress.country}</Card.Subtitle>

                <Card.Subtitle>Phone: {shippingAddress.phoneNumber}</Card.Subtitle>
                <Card.Footer>
                    <Button variant="success" onClick={() =>{
                        navigate("edit",{
                            state: {from:location, payload: shippingAddress},
                        });
                    }}>Edit</Button>
                    <Button variant="danger" onClick={openConfirmation}>Delete</Button>
                </Card.Footer>
            </Card.Body>
        </Card>

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
                    deleteCard(shippingAddress.id)
                }}>Confirm</Button>
                <Button variant="primary" onClick={closeConfirmation}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
}
export const ShippingAddressForm = () =>{
    const {data: {userId}} = useTypedSelector(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as {
        from : Location,
        addressType: number;
        payload?: AddressModel
    }
    
    let initialValue = locationState?.payload || {
            city: '',
            createdAt: new Date(new Date().toUTCString()),
            isDefault: false,
            phoneNumber: '',
            province: '',
            receiverName: '',
            streetAddress: '',
            updatedAt: new Date(new Date().toUTCString()),
            zipcode: '',
            country: '',
            addressType: locationState.addressType,
            userId: parseInt(userId)
    }

    return (
        <Formik initialValues={initialValue}
        validationSchema={createAddress}
        onSubmit={(values:AddressModel, formHelpers:FormikHelpers<AddressModel>) => {
            if(location.pathname.match(/edit$/i) && !!locationState?.payload?.id){
                const addressId = locationState.payload.id;
                addressAPIInstance.updateAddress(values,addressId.toString()).then(() =>{
                    navigate(-1);
                    toast("The item has been updated");
                }).catch((error: Error | AxiosError | any) =>{
                    let errorResponse = "Delete this item failed";
                    if(error instanceof AxiosError){
                        errorResponse = error.response?.data as string || errorResponse;
                    }
                    toast(errorResponse);
                });
            }
            else{
                addressAPIInstance.createAddress(values).then(()=>{
                    navigate(-1);
                    toast("New item has been added successfully");
                }).catch((error: Error | AxiosError | any) =>{
                    let errorStr = 'Failed';
                    if(error instanceof AxiosError){
                        errorStr = error!.response?.data || errorStr;
                    }
                });
            }

            formHelpers.setSubmitting(false);
        }}>
            {({values,touched,errors,handleBlur,handleChange,handleSubmit}) =>{
                return <Form onSubmit={handleSubmit}>
                    <h1>Billing address</h1>
                    <Form.Group controlId='controlReceiverName'>
                        <Form.Label>Receiver Name</Form.Label>
                        <Form.Control value={values.receiverName} 
                        name="receiverName" onChange={handleChange} 
                        onBlur={handleBlur}
                        isInvalid={touched.receiverName && !!errors.receiverName}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.receiverName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlCountry'>
                        <Form.Label>Country/Region/*...</Form.Label>
                        <Form.Control value={values.country} name="country" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.country && !!errors.country}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlProvince'>
                        <Form.Label>Province (optional)</Form.Label>
                        <Form.Control value={values.province} name="province" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.province && !!errors.province}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlStreetAddress'>
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control value={values.streetAddress} name="streetAddress" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.streetAddress && !!errors.streetAddress}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.streetAddress}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlZipcode'>
                        <Form.Label>Postcode / ZIP (optional)</Form.Label>
                        <Form.Control value={values.zipcode} name="zipcode" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.zipcode && !!errors.zipcode}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlZipcode'>
                        <Form.Label>Town / City</Form.Label>
                        <Form.Control value={values.city} name="city" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.city && !!errors.city}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='controlPhone'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="phone" value={values.phoneNumber} 
                        name="phoneNumber" 
                        onBlur={handleBlur}
                        onChange={handleChange} isInvalid={touched.phoneNumber && !!errors.phoneNumber}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Apply</Button>
                </Form>
            }}
        </Formik>
    )
}