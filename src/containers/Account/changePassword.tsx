import React from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {Formik,FormikHelpers} from 'formik';
import {Form as BootstrapForm, Container, Row, Col, Button, Spinner} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../../hooks';
import { ChangePasswordRequest, ResponseStatus } from '../../models';
import {changePasswordSchema} from '../../schemas';

export const ChangePassword = () => {
    const [searchParams] = useSearchParams();
    const {changePassword, resetStatus} = useActions();
    const {error,loading, status} = useTypedSelector((state) => state.auth);
    React.useEffect(()=>{
        if(status === ResponseStatus.SUCCESS){
            resetStatus();
        }
        return () =>{
            resetStatus();
        }
    },[])

    if(loading) return <Container className="p-5" data-text-align="middle">
        <Spinner animation="border"></Spinner>
    </Container>
    if(!searchParams.get("email") || !searchParams.get("token")){
        throw new Error("Bad request");
    }
    if(status === ResponseStatus.SUCCESS) return <SuccessChangePassword></SuccessChangePassword>

    return <Formik initialValues={{
        email: searchParams?.get("email") || "", 
        token: searchParams?.get("token") || "",
        password: "", 
        confirmPassword: "", 
        }}
        validationSchema={changePasswordSchema}
        onSubmit={(values: ChangePasswordRequest,formHelpers:FormikHelpers<ChangePasswordRequest>)=>{
            if(loading) return;
            changePassword(values);
            formHelpers.setSubmitting(false);
        }}
        >
        {({errors,touched,values,handleChange, handleSubmit,handleBlur}) => 
            {
                return (
                    <Container className="p-5">
                        <BootstrapForm 
                        className="login__paper p-5"
                        noValidate 
                        validated={!errors}
                        onSubmit={handleSubmit}
                        >

                            <legend>Change your password</legend>
                            <i>Typing your expected password</i>

                            <BootstrapForm.Group controlId="validation.Password" className="py-3">
                                <BootstrapForm.Label>Password</BootstrapForm.Label>
                                <BootstrapForm.Control  type="password" 
                                name="password" 
                                placeholder='Password' 
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-describedby="passwordHelper"
                                isValid={touched.password && !errors.password}
                                isInvalid={touched.password && !!errors.password}
                                ></BootstrapForm.Control>
                                <BootstrapForm.Text id="passwordHelper" muted>
                                    Your password must be more than 12 characters long
                                </BootstrapForm.Text>
                                <BootstrapForm.Control.Feedback type="invalid">{errors.password}</BootstrapForm.Control.Feedback>
                            </BootstrapForm.Group>

                            <BootstrapForm.Group controlId="validation.ConfirmPassword" className="py-3">
                                <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                                <BootstrapForm.Control type="password" 
                                name="confirmPassword" 
                                placeholder='Confirm Password' 
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isValid={touched.confirmPassword && !errors.confirmPassword}
                                isInvalid={!!errors.confirmPassword}></BootstrapForm.Control>
                                <BootstrapForm.Control.Feedback type="invalid">{errors.confirmPassword}</BootstrapForm.Control.Feedback>
                            </BootstrapForm.Group>

                            <Button type={'submit'} variant="success" className="login__btn">Submit</Button>

                            <div className="account__input--container py-1">
                                <small className='account__input--rightAlign'>
                                    <Link to='/auth/login'>
                                        I have remembered my account
                                    </Link>
                                </small>
                            </div>

                            <BootstrapForm.Control type="hidden" isInvalid={!!error}></BootstrapForm.Control>
                            <BootstrapForm.Control.Feedback type="invalid">{error && <>{error}</>}</BootstrapForm.Control.Feedback>
                        </BootstrapForm>
                    </Container>
                )
            }
        }
    </Formik>
}

const SuccessChangePassword = () =>{
    return <Container className="p-5" style={{minHeight: '80vh'}}>
        <div className="login__paper p-5">
            <h3>Changed password successfully</h3>
            <small>Back to <Link to="/auth/login">Login</Link></small>
        </div>
    </Container>
}