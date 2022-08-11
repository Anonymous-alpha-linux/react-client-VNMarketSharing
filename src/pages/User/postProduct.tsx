import React from 'react'
import { Formik, FormikHelpers,FormikProps } from 'formik';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import {  } from '../../config';
interface FormValues{
    productName: string,
    categories?: any[]
}
interface PostProductState {
    loading: boolean;
    error: string;
    currentStep: number;
}
export const PostProduct = () => {
    const [state, setState] = React.useState<PostProductState>({
        loading: false,
        error: '',
        currentStep: 1, 
    });
    function prevStep(){
        setState(o =>({
            ...o,
            currentStep: o.currentStep > 1 ? o.currentStep - 1 : o.currentStep
        }));
    }
    function nextStep(){
        setState(o =>({
            ...o,
            currentStep: o.currentStep < 2 ? o.currentStep + 1 : o.currentStep
        }));
    }
    return (
        <div>
            <h1>Upload your new product</h1>
            <i>Please select the properties for your product</i>
            <Formik initialValues={{
                productName: '',
            }}
            onSubmit={(values:FormValues,formHelpers: FormikHelpers<FormValues>) =>{

                formHelpers.setSubmitting(false);
            }}
            >
                {(props) =>{
                    const postProductFormSteps = [
                        {
                            key: 1,
                            element: <PostProductEntry formProps={props} onClick={nextStep}></PostProductEntry>
                        },
                        {
                            key: 2,
                            element: <PostProductDetail formProps={props} onCancel={prevStep}></PostProductDetail>
                        },
                    ]
                    return postProductFormSteps.find(s => s.key === state.currentStep)?.element;
                }}
            </Formik>
        </div>
    )
}

interface PostProductDetailProps{
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onCancel?: () => void;
    onSaveAndHide?: () => void;
    onUpdate?: () => void;
}
const PostProductDetail = ({formProps, onCancel, onSaveAndHide, onUpdate}:PostProductDetailProps) =>{
    return (<>
        <Form.Group controlId='postProductDetailBasic'>
            <h3>Product Basics</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <Form.Group controlId='postProductDetail'>
            <h3>Product specification</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <Form.Group controlId='postProductDetailBasic'>
            <h3>Product Selling</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <Form.Group controlId='postProductDetailBasic'>
            <h3>Transport</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <Form.Group controlId='postProductDetailBasic'>
            <h3>Other information</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <ButtonGroup>
            <Button variant='primary' onClick={onCancel}>Cancel</Button>
            <Button variant="primary" onClick={onSaveAndHide}>Save and cancel</Button>
            <Button variant="success" onClick={onUpdate}>Save and display</Button>
        </ButtonGroup>
    </>)
}

interface PostProductEntryProps{
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onClick?: () => void;
}
const PostProductEntry = ({formProps, onClick}: PostProductEntryProps) =>{
    return (
        <>
            <Form.Group controlId='postProductEntry'>
                <Form.Label>Product Name: </Form.Label>
                <Form.Control name="productName" 
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
                value={formProps.values.productName}></Form.Control>
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </Form.Group>
            <Button onClick={onClick} variant='success'>Next</Button>
        </>
    )
}