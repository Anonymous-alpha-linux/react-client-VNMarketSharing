import React from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {Formik,FormikHelpers} from 'formik';
import {Button, Form} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../../hooks';
import {RegisterRequest, ResponseStatus} from '../../models';
import { registerSchema } from '../../schemas';

function Register() {
    const {register,resetStatus} = useActions();
    const {status, loading} = useTypedSelector((state) => state.auth);

    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as {
        from: Location;
    };
    let from = locationState?.from?.pathname || "/";

    React.useEffect(()=>{
        if(status === ResponseStatus.SUCCESS){
            return navigate("/auth/confirmEmail");
        }
        return () =>{
            resetStatus();
        }
    },[status]);

    if(loading) return (<h1>Loading ...</h1>);
    return <Formik 
    initialValues={{email: "", password: "", confirmPassword: "", roleId: 3}}
    validationSchema={registerSchema}
    onSubmit={(values: RegisterRequest,formHelpers:FormikHelpers<RegisterRequest>)=>{
        if(loading) return;
        register(values,from);
        formHelpers.setSubmitting(false);
    }}>
        {({errors,touched,values,isSubmitting,handleChange,handleBlur,handleSubmit}) => <Form 
        noValidate
        onSubmit={handleSubmit}>
            <Form.Group controlId="validation.email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" 
                name="email" 
                placeholder='Email'
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.email && !errors.email}
                isInvalid={touched.email && !!errors.email}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validation.password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                name="password" 
                placeholder='Password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.password && !errors.password}
                isInvalid={touched.password && !!errors.password}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validation.password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" 
                name="confirmPassword" 
                placeholder='ConfirmPassword'
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.confirmPassword && !errors.confirmPassword}
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                >
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>

            <div className='account__input--container'>
                <Button type={'submit'}>Register</Button>
            </div>
            <div className="account__input--container">
                <span className='account__input--rightAlign'>
                    <Link to='/auth/login'>
                        I have account already
                    </Link>
                </span>
            </div>
        </Form>}
    </Formik>
}

export default Register