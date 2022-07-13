import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Formik,FormikHelpers} from 'formik';
import {Form,Button, Spinner, Col} from 'react-bootstrap';
import {LoginRequest} from '../../models';
import {useActions, useTypedSelector} from '../../hooks';
import { loginSchema } from '../../schemas';

const Login:React.FC = ()=>  {
    let location = useLocation();
    const locationState = location.state as {
        from?: Location
    }
    let from = locationState?.from?.pathname || "/";
    const {loading} = useTypedSelector((state) => state.auth);
    const {login,resetStatus} = useActions();

    React.useEffect(()=>{

        return () =>{
            resetStatus();
        }
    },[]);

    return <Formik 
        initialValues={{email: "",password:"",remember: false, returnURL: from}}
        validationSchema={loginSchema}
        onSubmit={(values: LoginRequest,formHelpers:FormikHelpers<LoginRequest>)=>{
            if(loading) return;
            login(values);
            formHelpers.setSubmitting(false);
        }}>
        {
            ({errors,touched,values,handleBlur,handleChange,handleSubmit})=> <Form noValidate validated={!errors} onSubmit={handleSubmit}>
            <Form.Group controlId="validation.email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" 
                    name="email" 
                    placeholder='Email'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    isValid={touched.email && !errors.email}
                    isInvalid={!!errors.email}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validation.password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                name="password" 
                placeholder='Password' 
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password}
                autoComplete={'current-password'}></Form.Control>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Link to='/auth/register'>Register new account</Link>

            <Form.Group controlId='validation.remember'>
                <Form.Check as={Col} type={'checkbox'} name="remember"></Form.Check>
                <Form.Label>Remember me</Form.Label>
            </Form.Group>
            <span className='account__input--rightAlign'>
                <Link to='/auth/confirm/changePassword'>
                    Forgot Password
                </Link>
            </span>
            <Button type={'submit'}>{loading ? 
            <>
                <Spinner as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"/>
            </>
                : "Login"}</Button>
        </Form>
        }
    </Formik>
}

export default Login