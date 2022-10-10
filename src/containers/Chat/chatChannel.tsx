import React from 'react';
import {Formik, FormikHelpers} from 'formik';
import {Button, Col, Form, Modal, ModalProps, Row, Stack} from 'react-bootstrap';
import moment from 'moment';
import {ChatHub} from '../../config';
import {useTypedSelector} from '../../hooks';
import {chatSchema, reviewProductSchema} from '../../schemas';
import "./index.css";
import { Input, Rating } from '../../components';
import { ReviewProductCreationDTO } from '../../models';
import { timeDifferenceString } from '../../utils';

interface MessageTarget {
    message: string;
    user: string;
}

type ChannelState = {
    chatHubConnection: ChatHub | null;
}
export const Channel: React.FC<{}> = () => {
    const {data} = useTypedSelector(state => state.auth);
    const [conversation, setConversation] = React.useState<MessageTarget[]>([{message: '', user: ''}]);
    const [state, setState] = React.useState<ChannelState>({
        chatHubConnection: null
    });

    // Chat hub socket connection
    React.useEffect(()=>{
        const {chatHubConnection} = state;
        if(!chatHubConnection){
            setState(o =>({
                ...o,
                chatHubConnection: new ChatHub()
            }));
            return;
        }

        chatHubConnection.connect();
        chatHubConnection.getHubConnection().onreconnecting(()=>{
            console.info("reconnecting");
        });
        chatHubConnection.getHubConnection().onreconnected((connectionId)=>{
            console.info("reconnected");
        });

        return () =>{
            chatHubConnection.disconnect();
        }
    },[state.chatHubConnection]);

    React.useEffect(()=>{
        if(state.chatHubConnection){
            state.chatHubConnection.receiveMessage((name:string,message:string)=>{
                setConversation((messageTarget) => [
                    ...messageTarget,
                    { message: message, user: name },
                ]);
            });
        }
    },[state.chatHubConnection])

    return (
        <div>
            <h3>Public chat</h3>
            <Formik initialValues={{message: ''}}
                enableReinitialize={true}
                validationSchema={chatSchema}
                onSubmit = {(values: {message: string}, formHelpers: FormikHelpers<{message: string}>) => {
                formHelpers.setSubmitting(false);
                state.chatHubConnection && state.chatHubConnection.sendMessageToAll(data.email, values.message);
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

// Review (Not reusable)
type Message = {
    subject: string;
    name: string;
    image: string;
    message: string;
    isMine: boolean;
    time: Date;
    replyAmount: number;
    replyList: {
        image: string,
        name: string,
        message: string,
        time: Date,
    }[],
    star?: number;
}

interface MessageEventHandler<T> {
    onSubmitForm: (message: T) => void;
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

interface MessageContainerOption {
    allowAutoReply?: boolean;
}

export const MessageContainer: React.FC<MessageContainerProps 
& MessageEventHandler<ReviewProductCreationDTO>
& MessageContainerOption> = ({messages, user,...props}) => {
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
            <Stack direction="vertical" style={{}} gap={3}>
                {messages.map((m,index) =>{
                    return <MessageStick key={index} allowAutoReply={props.allowAutoReply} {...m}></MessageStick>
                })}
            </Stack>
        </article>
        <aside>
            <ReviewForm 
                show={modalShow}  
                onHide={() => setModalShow(false)}
                productId={props.productId}
                userId={user.id}
                onSubmitForm={props.onSubmitForm}
            ></ReviewForm>
        </aside>
    </section>
}

const MessageStick = ({image, isMine, message, time, name,replyAmount,...props}: Message & MessageContainerOption) =>{
    return <div data-mine={isMine} className="message-stick__root">
        <div className="message-stick__container"> 
            <Row>
                <Col xs="auto" sm="auto">
                    <div className='message-stick__image' style={{background: `url(${image}) center / contain no-repeat`}}></div>
                </Col>
                <Col xs="auto" sm="auto">
                    <div data-mine={isMine} className="message-stick__message p-3">
                        <b>{props.subject}</b>
                        {!!props.star && <span className="mx-2"><Rating.Star percentage={props.star || 0}></Rating.Star></span>}
                        <p>Posted by {name} - {timeDifferenceString(time, new Date())}</p>
                        <span>
                            {message}
                        </span>
                    </div>
                </Col>                  
            </Row>
            <div className='ps-2 my-2 message-stick__reply--action'>
                {
                    props.replyList.map(p =>{
                        return <ReplyStick image={p.image} message={p.message} name={p.name} time={p.time}></ReplyStick>
                    })
                }
            </div>
        </div>
    </div>
}

type ReplyStickProps = {
    name: string;
    image: string;
    message: string;
    time: Date;
}

const ReplyStick = ({name, ...props}: ReplyStickProps) => {
    return <section className='reply-strick__container p-3'>
        <Row>
            <Col xs="auto" sm="auto">
                <div className="reply-strick__image" style={{background: `url(${props.image}) center / contain no-repeat`}}></div>
            </Col>
            <Col xs="auto" sm="auto">
                <div className="reply-stick__message p-3">
                    <h5>{name} replied to you - {timeDifferenceString(props.time, new Date())}</h5>
                    <span className='reply-stick__message--content'>
                        {props.message}
                    </span>
                </div>
            </Col>                  
        </Row>
    </section>
}

type ReviewState = {
    initialFormValues: ReviewProductCreationDTO;
}

const ReviewForm = (props: ModalProps & {
    productId: number;
    userId: number;
} & MessageEventHandler<ReviewProductCreationDTO>) =>{
    const [state, setState] = React.useState<ReviewState>({
        initialFormValues: {
            rate: 5,
            name: 'unknown',
            comment: '',
            subject: '',
            userId: props.userId,
            productId: props.productId
        }
    });
    const emotions = ["☹️", "🙁", "😐" , "🙂", "😃"];
    const labels = ["disappointed", "sad", "quite", "smile", "satisfied"]

    React.useEffect(() =>{
        if(props.productId && props.userId){
            setState(o =>({
                ...o,
                initialFormValues: {
                    ...o.initialFormValues, 
                    userId: props.userId,
                    productId: props.productId
                },
                productId: props.productId
            }));
        }
    },[props]);

    return <>
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Formik initialValues={state.initialFormValues}
                validationSchema={reviewProductSchema}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) =>{
                    formikHelpers.setSubmitting(false);
                    if(values.productId && values.userId){
                        props.onSubmitForm(values)
                    }
                }}>
                    {({values,errors,touched,handleChange, handleSubmit,...formikProps}) =>{
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

                                    <div>
                                        {!!formikProps.submitCount && <i style={{color: 'red'}}>
                                            <pre>
                                                {Object
                                                .entries(errors)
                                                .map(([_,val]) => "- " + val).join('\n')}
                                            </pre>
                                        </i>}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" variant="success" style={{background: 'var(--clr-logo)', color:'#fff'}}>Send</Button>
                                    <Button onClick={props.onHide}>Close</Button>
                                </Modal.Footer>
                            </Form>
                        </> 
                    }}
                </Formik>
        </Modal>
    </>
}