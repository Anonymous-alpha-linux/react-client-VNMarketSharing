import React, { useEffect, useState } from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {Formik,FormikHelpers, FormikProps, } from 'formik';
import {Button, Form, Container, Row, Col, Spinner, Image, Modal} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../../hooks';
import { RegisterWithUserRequest, ResponseStatus} from '../../models';
import { registerWithUserSchema } from '../../schemas';
import "./index.css";
import { GoPrimitiveDot } from 'react-icons/go';
import compression from 'browser-image-compression';
import { toast } from 'react-toastify';


function Register() {
    const {register,resetStatus} = useActions();
    const {status, loading, error} = useTypedSelector((state) => state.auth);
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as {
        from: Location;
    };
    let from = "/auth/confirmEmail/redirect";

    React.useEffect(() => {
        if(status === ResponseStatus.SUCCESS){
            return navigate("/auth/confirmEmail");
        }
        if(status === ResponseStatus.FAILED){
            toast.error(error);
        }
        return () =>{
            resetStatus();
        }
    },[status]);

    return (
        <>
            <div data-text-align="middle">
                <div className="mb-3">
                    <StepDotTracker step={2} active={step}></StepDotTracker>
                </div>
                <Button variant={"success"} onClick={() =>{setStep(step ? 0 : 1)}}>{step === 0 ? "Next" : "Previous"}</Button>
            </div>

            <Formik 
                initialValues={{
                    account: {
                        email: "",
                        password: "",
                        confirmPassword: "",
                        roleId: 3
                    },
                    organizationName: "",
                    biography: "",
                    dateOfBirth: new Date(),
                }}
                validationSchema={registerWithUserSchema}
                onSubmit={(values: RegisterWithUserRequest,formHelpers:FormikHelpers<RegisterWithUserRequest>)=>{
                    if(loading) return;
                    register(values, from);
                    formHelpers.setSubmitting(false);
            }}>
                {(formProps) => (
                    <Container className="p-5">
                        <Form 
                        className="register__paper p-5"
                        noValidate
                        onSubmit={formProps.handleSubmit}>
                            {
                                step === 0 ? 
                                (<>
                                    <legend>Sign-Up</legend>
                                    <i>Sign your email and password</i></>) : 
                                (<>
                                    <legend>User Profile</legend>
                                    <i>Additional some information before register</i></>)
                            } 

                            {step === 0 ? (<AccountCreationForm {...formProps}></AccountCreationForm>) : (<UserCreationForm {...formProps}></UserCreationForm>)}
                            
                        </Form>
                    </Container>
                )}
            </Formik>
            
            {loading && (<Container className="px-auto" style={{minHeight: "80vh"}}>
                <Modal show={true}>
                    <Modal.Body>
                        <h3 data-text-align="center" style={{textTransform: 'uppercase', fontWeight: '700'}}>We're handling your provided informations.</h3>
                        <Row className="justify-content-center" data-align="middle">
                            <Col xs="auto" sm="auto">
                                <i>Waiting</i>
                            </Col>
                            <Col xs="auto" sm="auto">
                                <Spinner animation="border" ></Spinner>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Container>)}
        </>
    )
}

function StepDotTracker({step, active}: {step: number, active?: number}) {
    const [activeStep, setActiveStep] = React.useState(active || 0);

    useEffect(() =>{
        setActiveStep(active || 0);
    }, [active]);

    return (<>
        {Array.from(Array(step).keys()).map((_,index) =>{
            return (
                <span className='register__step mb-2' data-active={activeStep===index}>
                    <GoPrimitiveDot></GoPrimitiveDot>
                </span>)
        })}
    </>)
}

function AccountCreationForm(formProps: FormikProps<RegisterWithUserRequest>) {
    return (<div className='register__step--container'>
        <Form.Group controlId="validation.email" className="py-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" 
            name="account.email" 
            placeholder='Email'
            value={formProps.values.account.email}
            onChange={formProps.handleChange}
            onBlur={formProps.handleBlur}
            isValid={formProps.touched?.account?.["email"] && !formProps.errors?.account?.email}
            isInvalid={formProps.touched?.account?.["email"] && !!formProps.errors?.account?.email}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">{formProps.errors?.["account"]?.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="validation.password" className="py-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" 
            name="account.password" 
            placeholder='Password'
            value={formProps.values.account.password}
            onChange={formProps.handleChange}
            onBlur={formProps.handleBlur}
            isValid={formProps.touched?.account?.password && !formProps.errors?.account?.password}
            isInvalid={formProps.touched?.account?.password && !!formProps.errors?.account?.password}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">{formProps.errors?.account?.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="validation.password" className="py-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" 
            name="account.confirmPassword" 
            placeholder='ConfirmPassword'
            value={formProps.values.account.confirmPassword}
            onChange={formProps.handleChange}
            onBlur={formProps.handleBlur}
            isValid={formProps.touched?.account?.confirmPassword && !formProps.errors?.account?.confirmPassword}
            isInvalid={formProps.touched?.account?.confirmPassword && !!formProps.errors?.account?.confirmPassword}
            >
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formProps.errors?.account?.confirmPassword}</Form.Control.Feedback>
        </Form.Group>
    </div>)
}

function UserCreationForm({errors,touched,values,handleChange,handleBlur, ...props}: FormikProps<RegisterWithUserRequest>) {
    const [url, setUrl] = React.useState("");
    
    useEffect(() => {
        try{
            if(values?.image){
                compression.getDataUrlFromFile(values.image).then(response =>{
                    setUrl(response);
                }); 
            }
        }
        catch(error: any){
            toast.error(error?.message);
        }
    },[values.image]);

    return (
        <div className="register__step--container">
            <Form.Group controlId="account.name" className="py-3">
                <div className='my-4 mx-auto' data-text-align="middle">
                    <Image src={url} roundedCircle style={{maxWidth: '120px', maxHeight: '120px', boxShadow: '0 0 12px black'}}></Image>
                </div>
                <Form.Control
                    type="file"
                    name="image"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                        props.setFieldValue("image", e.target?.files?.item(0), true);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.image && !!errors.image}
                ></Form.Control>
                <Form.Control.Feedback type='invalid'>{errors.image}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validation.organizationName" className="py-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="email" 
                name="organizationName" 
                placeholder='Name'
                value={values.organizationName}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.organizationName && !errors.organizationName}
                isInvalid={touched.organizationName && !!errors.organizationName}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{errors.organizationName}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validation.biography" className="py-3">
                <Form.Label>Biography</Form.Label>
                <Form.Control type="text" 
                as={"textarea"}
                name="biography" 
                placeholder='biography'
                value={values.biography}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.biography && !errors.biography}
                isInvalid={touched.biography && !!errors.biography}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{errors.biography}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validation.dateOfBirth" className="py-3">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control type="date" 
                    name="dateOfBirth" 
                    placeholder='Date Of Birth'
                    // value={moment(values?.["dateOfBirth"]).format("yyyy dd MM")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.dateOfBirth && !errors.dateOfBirth}
                    isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                >
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors?.["dateOfBirth"] as string}</Form.Control.Feedback>
            </Form.Group>

            <div className='account__input--container'>
                <Button className="register__btn" type={'submit'}>Register</Button>
            </div>

            <div className="account__input--container py-1">
                <span className='account__input--rightAlign'>
                    <Link to='/auth/login'>
                        I have account already
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default Register