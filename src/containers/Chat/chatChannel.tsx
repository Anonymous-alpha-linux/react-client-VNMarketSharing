import React from 'react';
import {Formik, FormikHelpers} from 'formik';
import {Button, Col, Form, Modal, ModalProps, Row, Stack} from 'react-bootstrap';
import moment from 'moment';
import {chatHubConnection} from '../../config';
import {useTypedSelector} from '../../hooks';
import {chatSchema} from '../../schemas';
import "./index.css";
import { Input, Rating } from '../../components';
import { ReviewProductCreationDTO } from '../../models';

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
            <h3>Public chat</h3>
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

type Message = {
    name: string;
    image: string;
    message: string;
    isMine: boolean;
    time: Date;
    star?: number;
}
interface MessageContainerProps {
    messages: Message[];
    user: {
        id: number;
        image: string;
        name: string;
        status: "online" | "offline" | "busy";
    },
    productId: number;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({messages, user, ...props}) => {
    const [modalShow, setModalShow] = React.useState(false);

    return <section>
        <header className='mb-4'>
            <Row>
                <Col>
                    <Button variant="success" className="message-container__button--review" onClick={() => setModalShow(true)}>Write A Review</Button>
                </Col>
            </Row>
        </header>
        <article>
            <Stack direction="vertical" style={{overflowY: 'auto'}} gap={3}>
                {messages.map((m,index) =>{
                    return <MessageStick key={index} {...m}></MessageStick>
                })}
            </Stack>
        </article>
        <aside>
            <Review 
                show={modalShow}  
                onHide={() => setModalShow(false)}
                productId={props.productId}
            ></Review>
        </aside>
    </section>
}

const MessageStick = ({image, isMine, message, time, name,...props}: Message) =>{
    return <div data-mine={isMine} className="message-stick__root">
        <div className="message-stick__container"> 
            <Row>
                <Col xs="auto" sm="auto">
                    <div style={{background: `url(${image}) center / contain no-repeat`, borderRadius: '50%', width: '60px', height: '70px'}}></div>
                </Col>
                <Col xs="auto" sm="auto">
                    <div data-mine={isMine} className="message-stick__message p-3">
                        <b>{name}</b>
                        <span className="mx-2"><Rating.Star percentage={props.star || 0}></Rating.Star></span>
                        <p>Posted at {moment(time).format("HH:mm:ss")}</p>
                        <span>
                            {message}
                        </span>
                    </div>
                </Col>                  
            </Row>
        </div>
    </div>
}

type ReviewState = {
    initialFormValues: ReviewProductCreationDTO;
}

const Review = (props: ModalProps & {
    productId: number;
}) =>{
    const {data: {userId}} = useTypedSelector(s => s.user);
    const [state, setState] = React.useState<ReviewState>({
        initialFormValues: {
            rate: 5,
            name: 'unknown',
            comment: '',
            subject: '',
            userId: Number(userId),
            productId: props.productId
        }
    });
    const emotions = ["☹️", "🙁", "😐" , "🙂", "😃"];
    const labels = ["disappointed", "sad", "quite", "smile", "satisfied"]

    React.useEffect(() =>{
        setState(o =>({
            ...o,
            initialFormValues: {
                ...o.initialFormValues,
                productId: props.productId
            }
        }))
    },[props.productId]);

    return <>
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Formik initialValues={state.initialFormValues}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) =>{
                    formikHelpers.setSubmitting(false);
                    if(values.productId){
                        console.log(values);
                    }
                }}>
                    {({values, handleChange, handleSubmit}) =>{
                        return <>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        WRITE A REVIEW
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                        <Form.Group as={Row} xs={"auto"} sm={"auto"} controlId='rating'>
                                            <Col data-text-align="middle">
                                                <Form.Label>
                                                    Rating
                                                </Form.Label>
                                            </Col>
                                            <Col data-text-align="middle">
                                                <Input.StarRate name='rate' onChange={handleChange} value={values.rate}></Input.StarRate>
                                            </Col>
                                            <Col data-text-align="middle"> 
                                                <span className="review__emotion">{emotions[values.rate - 1]}</span>
                                                <span>{labels[values.rate - 1]}</span>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId='name'>
                                            <Form.Label>Display Name</Form.Label>
                                            <Form.Control name="name" value={values.name} onChange={handleChange}></Form.Control>
                                        </Form.Group>   

                                        <Form.Group controlId='subject'>
                                            <Form.Label>Review Subject</Form.Label>
                                            <Form.Control name="subject" value={values.subject} onChange={handleChange}></Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId='comment'>
                                            <Form.Label>Comments</Form.Label>
                                            <Form.Control as="textarea" 
                                            name="comment" 
                                            value={values.comment}
                                            rows={8} 
                                            onChange={handleChange}
                                            placeholder={"Leave your feedback"}></Form.Control>
                                        </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit">Send</Button>
                                    <Button onClick={props.onHide}>Close</Button>
                                </Modal.Footer>
                            </Form>
                        </> 
                    }}
                </Formik>
        </Modal>
    </>
}