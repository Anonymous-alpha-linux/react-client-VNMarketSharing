import { Formik, FormikHelpers, Field } from 'formik';
import { Button, Form } from 'react-bootstrap';
import React from 'react'
import { useActions, useTypedSelector } from '../../hooks'
import { ResponseStatus } from '../../models';
import {sendEmailToChangePasswordSchema} from '../../schemas';

export const SendEmailToChangePassword = () => {
    const {loading,error,status} = useTypedSelector(state => state.auth);
    const {sendEmailToChangePassword, resetStatus} = useActions();
    React.useEffect(() =>{
        return () =>{
            resetStatus();
        }
    },[]);

    if(loading) return <h1>We are handling it.<br/>Wait a few minutes</h1>
    if(status == ResponseStatus.SUCCESS) return <h1>Verify email successfully<br></br><p>Please check your email</p></h1>
    return (
        <Formik 
        initialValues={{email: ""}}
        validationSchema={sendEmailToChangePasswordSchema}
        onSubmit={(values:{email:string}, formHelpers: FormikHelpers<{email:string}>) =>{
            if(loading) return;
            sendEmailToChangePassword(values.email);
            formHelpers.setSubmitting(false);
        }}>
            {({touched,errors,values,isValidating,handleChange,handleBlur,handleSubmit})=> {
        return <Form noValidate
                    onSubmit={handleSubmit}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" 
                        name="email" 
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={touched.email && !!errors.email}
                        isValid={touched.email && !errors.email}
                        placeholder='Email'></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                <Button type="submit">{loading ? "Loading..." : "Send"}</Button>
            </Form>}}
        </Formik>
    )
}