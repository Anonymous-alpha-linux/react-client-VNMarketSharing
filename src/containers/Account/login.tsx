import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Formik,FormikHelpers} from 'formik';
import {Form,Button, Spinner, Container, Row, Col} from 'react-bootstrap';
import {LoginRequest, ResponseStatus} from '../../models';
import {useActions, useTypedSelector} from '../../hooks';
import { loginSchema } from '../../schemas';
import "./index.css";

const Login:React.FC = ()=>  {
    let navigate = useNavigate();
    let location = useLocation();
    const locationState = location.state as {
        from?: Location
    }
    let from = "/auth/confirmEmail/redirect";
    const {loading,status,error} = useTypedSelector((state) => state.auth);
    const {login,resetStatus} = useActions();

    React.useEffect(()=>{
        if(status != ResponseStatus.NOT_RESPONSE){
            resetStatus();
        }
        return () =>{
            resetStatus();
        }
    },[status]);

    return <Formik 
        initialValues={{email: "",password:"",remember: false, returnURL: from}}
        validationSchema={loginSchema}
        onSubmit={(values: LoginRequest,formHelpers:FormikHelpers<LoginRequest>)=>{
            if(loading) return;
            login(
                values,
                () => {
                    
                }, (error) =>{
                    if(error.response?.status === 403){
                        navigate("/auth/confirmEmail");
                    }
            });
            formHelpers.setSubmitting(false);
        }}>
        {
            ({errors,touched,values,handleBlur,handleChange,handleSubmit})=> (
                <Container className="p-5">
                    <Form noValidate className="login__paper p-5" validated={!errors} onSubmit={handleSubmit}>
                        <legend>Sign-In</legend>
                        <i>Sign your account or register to join us</i>

                        <Form.Group controlId="validation.email" className="py-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" 
                                name="email" 
                                placeholder='Email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                isValid={touched.email && !errors.email}
                                isInvalid={touched.email && !!errors.email}
                                ></Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="validation.password" className="py-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" 
                            name="password" 
                            placeholder='Password' 
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            isValid={touched.password && !errors.password}
                            isInvalid={touched.password && !!errors.password}
                            autoComplete={'current-password'}></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Button className="login__btn my-3" variant={'success'} type={'submit'} disabled={loading}>{loading ? 
                            <>
                                <Spinner as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"/>
                            </>
                            : "Login"}</Button>

                            <Form.Control type="hidden" isInvalid={!!error}></Form.Control>
                            <Form.Control.Feedback type="invalid">{error && <>{error}</>}</Form.Control.Feedback>

                        <Form.Group controlId='validation.remember'>
                            <Form.Check name="remember" 
                            onChange={handleChange} 
                            label="Remember me"
                            checked={values.remember}></Form.Check>
                        </Form.Group>
                        
                        <Form.Group as={Row} className="py-1"> 
                            <Col xs={'auto'} sm={'auto'}>
                                <Form.Text>
                                    <Link to='/auth/confirm/changePassword'>
                                        Forgot Password
                                    </Link>
                                </Form.Text>
                            </Col>

                            <Col xs={'auto'} sm={'auto'}>
                                <Form.Text>
                                    <Link to='/auth/register'>Register new account</Link>
                                </Form.Text>
                            </Col>
                        </Form.Group>
                    </Form>
                </Container>
        )}
    </Formik>
}

export default Login