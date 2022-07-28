import React from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {Formik,FormikHelpers} from 'formik';
import {Form as BootstrapForm,} from 'react-bootstrap';
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

    if(loading) return <h1>Loading...</h1>
    if(!searchParams.get("email") || !searchParams.get("token")){
        throw new Error("Bad request");
    }
    if(status === ResponseStatus.SUCCESS) return <SuccessChangePassword></SuccessChangePassword>
    return <Formik initialValues={{
        email: searchParams.get("email") || "", 
        token: searchParams.get("token") || "",
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
                return <BootstrapForm 
                noValidate 
                validated={!errors}
                onSubmit={handleSubmit}
                >
                    <BootstrapForm.Group controlId="validation.Password">
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

                    <BootstrapForm.Group controlId="validation.ConfirmPassword">
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

                    <input type={'submit'} value="Submit"></input>

                    <div className="account__input--container">
                        <span className='account__input--rightAlign'>
                            <Link to='/auth/login'>
                                I have remembered my account
                            </Link>
                        </span>
                    </div>

                    <BootstrapForm.Control type="hidden" isInvalid={!!error}></BootstrapForm.Control>
                    <BootstrapForm.Control.Feedback type="invalid">{error && <>{error}</>}</BootstrapForm.Control.Feedback>
                </BootstrapForm>
            }
        }
    </Formik>
}

const SuccessChangePassword = () =>{
    return <>
        <h1>Changed password successfully</h1>
        <p>Back to <Link to="/auth/login">Login</Link></p>
    </>
}