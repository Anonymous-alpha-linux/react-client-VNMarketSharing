import React from 'react';
import { Formik, FormikHelpers, FormikValues } from "formik";
import { Row, Col, Button, Form, InputGroup, Modal } from "react-bootstrap";
import {useMediaQuery} from 'react-responsive';
import { RiEdit2Line } from 'react-icons/ri';
import { useTypedSelector } from "../../hooks";
import "./index.css";
import { 
    SellerProfileProps,
    SellerProfileState,
    SellerProfileCreationProps, 
    SellerProfileCreationState, 
    SellerProfileHeaderState} from "./seller";
import { sellerProfileCreationSchema } from '../../schemas';
import { User } from '../../containers';
import { transformImagetoString } from '../../utils';

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export const SellerProfile = () => {
    const [state, setState] = React.useState<SellerProfileState>({
        showcase: true
    });
    // Get the page of seller

    return <>
        <section className="p-3">
            <h2>Shop Profile</h2>
            <section className="seller-profile__header">
                <SellerProfileHeader></SellerProfileHeader>
            </section>

            <section className="seller-profile__body">
                <SellerProfileCreation></SellerProfileCreation>
            </section>
        </section>
    </>
}

type FormValues = {
    name: string;
    description: string;
    biography: string;
    userId: string;
    bannerUrl?: File;
    phone: string;
    email: string;
}

const SellerProfileHeader = () => {
    type SellerProfileImageInput = {
        avatar?: File;
        banner?: File;
    }
    
    const {data: {name, bannerUrl, pageAvatar}, loading} = useTypedSelector(s => s.seller);
    const {data: {avatar, username}} = useTypedSelector(s => s.user);
    const [state, setState]= React.useState<SellerProfileHeaderState>({
        avatar: pageAvatar || avatar,
        banner: bannerUrl,
        showCrop: false
    });
    
    return <>
        <div className="seller-profile__banner"></div>
        <Formik
            initialValues={{
            }}
            onSubmit={(values: FormikValues, formHelpers: FormikHelpers<SellerProfileImageInput>) => {
                formHelpers.setSubmitting(false);
            }}
        >
            {
                ({values, errors, touched, handleChange, handleBlur, handleSubmit}) => {
                    return <>
                        <Row className="mb-5"
                            md={2} lg={3}
                            style={{
                                position: 'relative',
                                alignItems: 'flex-end'
                            }}>
                            <Col sm={"auto"} md={3} lg={3}
                                className="seller-profile__avatar--container">
                                <div className="seller-profile__avatar"
                                style={{
                                    background: `url(${state.avatar || defaultAvatar}) 0 / contain no-repeat`
                                }}>
                                    <span className="seller-profile__avatar--edit"
                                    onClick={() => {
                                        setState(o => ({
                                            ...o,
                                            showCrop: true
                                        }));
                                    }}>
                                        <RiEdit2Line></RiEdit2Line>
                                    </span>
                                </div>
                            </Col>
                            <Col sm={8} md={"auto"} lg={5} className="py-3 seller-profile__text--container">
                                <h4 className="seller-profile__text--name">{username}</h4>
                                <i className="seller-profile__text--sologan"
                                style={{
                                    
                                }}>Update Your Photo and Personal Details</i>
                            </Col>
                            <Col lg={4} className="mt-3">
                                <div className="seller-profile__header--buttons">
                                    <Button className="px-5" style={{background: "var(--clr-logo)"}}>Save</Button>
                                    {" "}
                                    <Button className="px-5" style={{background: '#637381'}}>Cancel</Button>
                                </div>
                                <pre>{JSON.stringify(values, null , 4)}</pre>
                            </Col>
                        </Row>
                        <Modal show={state.showCrop} onHide={() => setState(o => ({...o, showCrop: false}))}>
                            <Modal.Header closeButton>
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <User.Thumb
                                        image={state.avatar || null}
                                        setImage={(newImage: File) =>{
                                            transformImagetoString(newImage).then(value =>{
                                                console.log(value);
                                                setState(o => ({
                                                    ...o,
                                                    avatar: value 
                                                }))
                                            })
                                        }}
                                        roundedCircle={true}
                                        styleThumb={{
                                            width: '120px',
                                            height: '120px'
                                        }}
                                        allowResize={false}
                                        showCrop={state.showCrop}
                                    ></User.Thumb>
                            </Modal.Body>
                        </Modal>
                    </>
                }
            }
        </Formik>
    </>
}

const SellerProfileCreation = (props: SellerProfileCreationProps) =>{
    const {data: { userId, username }} = useTypedSelector(s => s.user);
    const [state, setState] = React.useState<SellerProfileCreationState>({});
    const isFloatLeftLabel = useMediaQuery({
        query: '(max-width: 576px)' 
    });

    return <>
        <Formik initialValues={{
                name: username,
                description: "",
                biography: "",
                userId: userId,
                phone: "",
                email: ""
            }}
            validationSchema={sellerProfileCreationSchema}
            onSubmit={(values: FormValues, formHelpers: FormikHelpers<FormValues>) =>{
                formHelpers.setSubmitting(false);
            }}>
            {
                (props) =>{
                    return <>
                        <Form onSubmit={props.handleSubmit}>
                            <Form.Group as={Row} sm={2} controlId="userPageProfileName">
                                <Form.Label data-text-align={isFloatLeftLabel? "left":"right"} column sm={3} md={2}>Page Name</Form.Label>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Control name="name" 
                                            value={props.values.name}
                                            isInvalid={props.touched.name && !!props.errors.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            aria-describedby="name"
                                        ></Form.Control>
                                        <InputGroup.Text id="name">{props.values.name.length} / 25</InputGroup.Text>
                                        <Form.Control.Feedback type="invalid">{props.errors.name}</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} sm={2} controlId="userPageProfileEmail">
                                <Form.Label data-text-align={isFloatLeftLabel? "left":"right"} column sm={3} md={2}>Email</Form.Label>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Control name="email" 
                                            value={props.values.email}
                                            isInvalid={props.touched.email && !!props.errors.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            aria-describedby="email"
                                        ></Form.Control>
                                        <InputGroup.Text id="email">@</InputGroup.Text>
                                        <Form.Control name="email"></Form.Control>
                                        <Form.Control.Feedback type="invalid">{props.errors.email}</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} sm={2} controlId="userPageProfilePhone">
                                <Form.Label data-text-align={isFloatLeftLabel? "left":"right"} column sm={3} md={2}>Phone</Form.Label>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="name">+84</InputGroup.Text>
                                        <Form.Control name="name" 
                                            value={props.values.phone}
                                            isInvalid={props.touched.phone && !!props.errors.phone}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            aria-describedby="name"
                                        ></Form.Control>
                                        <Form.Control.Feedback type="invalid">{props.errors.name}</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="userPageProfileDescription">
                                <Form.Label data-text-align={isFloatLeftLabel? "left":"right"} 
                                column sm={3} md={2}>Slogan</Form.Label>
                                <Col sm={6}>
                                    <InputGroup className="mb-3">
                                        <Form.Control name="description" 
                                            style={{ display: "block"}}
                                            value={props.values.description}
                                            isInvalid={props.touched.description && !!props.errors.description}
                                            aria-describedby='slogan'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        ></Form.Control>
                                        <Form.Control.Feedback type="invalid">{props.errors.description}</Form.Control.Feedback>
                                        <Form.Text id="slogan" muted>Send your slogan to client</Form.Text>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="userPageProfileBiography">
                                <Form.Label data-text-align={isFloatLeftLabel? "left":"right"} column sm={3} md={2}>Description</Form.Label>
                                <Col sm={6}>
                                    <Form.Control name="biography" 
                                        as="textarea"
                                        rows={10}
                                        value={props.values.biography}
                                        isInvalid={props.touched.biography && !!props.errors.biography}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        aria-describedby={"biography"}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">{props.errors.biography}</Form.Control.Feedback>
                                    <Form.Text id="biography" muted>Specify some information like: your product branches, selling items, price,...</Form.Text>
                                </Col>
                            </Form.Group>
                            <Row sm={2} className="mt-3">
                                <Col sm={2}></Col>
                                <Col sm={5}>
                                    <Button type="submit" style={{background: 'var(--clr-logo)'}}>Submit</Button>
                                    {" "}
                                    <Button >Cancel</Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                }
            }
        </Formik>
    </>
}