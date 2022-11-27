import { Formik, FormikHelpers } from 'formik';
import { Button, Col, Row, Container, Form } from 'react-bootstrap';
import React from 'react'
import { useActions, useTypedSelector } from '../../hooks'
import { ResponseStatus } from '../../models';
import {sendEmailToChangePasswordSchema} from '../../schemas';
import './index.css';
import { CustomLink } from '../../components';

export const    SendEmailToChangePassword = () => {
    const {loading,status} = useTypedSelector(state => state.auth);
    const {sendEmailToChangePassword, resetStatus} = useActions();
    React.useEffect(() =>{
        return () =>{
            resetStatus();
        }
    },[]);

    if(loading) return <Container className="p-5" style={{minHeight:'80vh'}}>
        <div className='p-5 email-confirm__paper'>
            <h3>
                We are handling it.<br/>
                <p className="email-confirm__waiter">
                    Wait a few minutes
                </p>
            </h3>
        </div>
    </Container>
    
    if(status == ResponseStatus.SUCCESS) return (
    <Container className="p-5" style={{minHeight: '80vh'}}>
        <div className="email-confirm__paper p-5">
            <h3>
                Verify email successfully<br></br><p>Please check your email</p>
            </h3>
        </div>
    </Container>);

    return (
        <Formik 
        initialValues={{email: ""}}
        validationSchema={sendEmailToChangePasswordSchema}
        onSubmit={(values:{email:string}, formHelpers: FormikHelpers<{email:string}>) =>{
            if(loading) return;
            sendEmailToChangePassword(values.email, "/auth/changePassword");
            formHelpers.setSubmitting(false);
        }}>
            {({touched,errors,values,isValidating,handleChange,handleBlur,handleSubmit})=> {
        return (
            <Container className="p-5" style={{minHeight:'80vh'}}>
                <Form noValidate
                    className="login__paper p-5"
                    onSubmit={handleSubmit}>
                    <legend>Change Password</legend>
                    <i>Specify your email to reset your password</i>

                    <Form.Group as={Row} className="pt-5 pb-3">
                        <Form.Label as={Col} xs="auto">
                            <b>
                                Email
                            </b>
                        </Form.Label>
                        <Col>
                            <Form.Control type="email" 
                                name="email" 
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={touched.email && !!errors.email}
                                isValid={touched.email && !errors.email}
                                placeholder='Email'></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <CustomLink to="/auth/login">
                        <p>
                            Remembered account
                        </p>
                    </CustomLink>

                    <Button type="submit" variant="success" className="login__btn">{loading ? "Loading..." : "Send"}</Button>
                </Form>
            </Container>
            )}}
        </Formik>
    )
}