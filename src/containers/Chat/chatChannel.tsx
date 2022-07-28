import React from 'react';
import {Formik, FormikHelpers} from 'formik';
import {Form} from 'react-bootstrap';

import {chatHubConnection} from '../../config';
import {useTypedSelector} from '../../hooks';
import {chatSchema} from '../../schemas';

interface MessageTarget {
    message: string;
    user: string;
}
export const Channel: React.FC<{}> = () => {
    const {data} = useTypedSelector(state => state.auth);
    const [conversation, setConversation] = React.useState<MessageTarget[]>([{message: '', user: ''}]);

    React.useEffect(()=>{
        chatHubConnection.receiveMessage((name:string,message:string)=>{
            setConversation((messageTarget) => [
                    ...messageTarget,
                    { message: message, user: name },
                ]);
        });
    },[])

    return (
        <div>
            <h1>Public chat</h1>
            <Formik initialValues={{message: ''}}
                validationSchema={chatSchema}
                onSubmit = {(values: {message: string}, formHelpers: FormikHelpers<{message: string}>) => {
                chatHubConnection.sendMessageToAll(data.email, values.message);
                formHelpers.setSubmitting(false);
                formHelpers.setTouched({});
                formHelpers.setValues({message:''});
            }}>
                {({errors,touched, values, handleChange, handleSubmit, handleBlur}) =>{
                    return <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="validation.Message">
                            <Form.Label>Message</Form.Label>
                            <Form.Control type="text"
                            name="message"
                            placeholder='Type your message'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.message}
                            isInvalid={touched.message && !!errors.message}
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                }}
            </Formik>
            {conversation.map((c,indx) => <div key={indx}>
                <h1>{c.user}</h1>
                <span>{c.message}</span>
            </div>)}
        </div>
    )
}