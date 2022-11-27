import React from 'react';
import { Formik, FormikHelpers } from "formik";
import { Row, Col, Button, Form, InputGroup, Modal } from "react-bootstrap";
import {useMediaQuery} from 'react-responsive';
import { RiEdit2Line } from 'react-icons/ri';
import { useActions, useTypedSelector } from "../../hooks";
import "./index.css";
import { 
    SellerProfileProps,
    SellerProfileState,
    SellerProfileCreationProps, 
    SellerProfileCreationState, 
    SellerProfileHeaderState} from "./seller";
import { sellerProfileCreationSchema, sellerChangeAvatar } from '../../schemas';
import { User } from '../../containers';
import { transformImagetoString } from '../../utils';
import { sellerAPIInstance } from '../../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export const SellerProfile = () => {
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
    
    const {data: { bannerUrl, pageAvatar}} = useTypedSelector(s => s.seller);
    const {data: {avatar, username, userId}} = useTypedSelector(s => s.user);
    const [state, setState]= React.useState<SellerProfileHeaderState>({
        avatar: pageAvatar || avatar,
        banner: bannerUrl,
        showCrop: false
    });
    const [editAvatar, changeEditState] = React.useState(false);
    const functions = {
        initializeState(){
            if(pageAvatar || avatar){
                axios.get(pageAvatar || avatar, {
                    responseType: 'blob'
                })
                .then(r =>{
                    setState(o =>({
                        ...o,
                        avatar: new File([r.data], "file" + Math.random() * 100000)
                    }));
                })
                .catch(error =>{
                    if(error){
                        axios.get(defaultAvatar, {
                                responseType:'blob'
                            })
                            .then((r) =>{
                                setState(o =>({
                                    ...o,
                                    avatar: new File([r.data], "file" + Math.random() * 100000)
                                }))
                            })
                    }
                });
            }
        },
        editOrSaveAvatarButton(isEdit: boolean, handleSubmit: () => void){
            return isEdit ? (
                <>
                    <Button className="px-5 me-2" onClick={() =>{
                        handleSubmit();
                        changeEditState(false);
                    }} style={{background: "var(--clr-logo)"}}>Save</Button>
                    <Button className="px-5" onClick={() => changeEditState(false)} style={{background: '#637381'}}>Cancel</Button>
                </>
            ):
            (
                <>
                    <Button className="px-5" onClick={() => changeEditState(true)} style={{background: "var(--clr-logo)"}}>Edit</Button>
                </>
            )
        },
        toggleEditAvatar(isEdit: boolean){
            return isEdit && (
                <span className="seller-profile__avatar--edit"
                    onClick={() => {
                        setState(o => ({
                            ...o,
                            showCrop: true
                        }));
                    }}>
                    <RiEdit2Line></RiEdit2Line>
                </span>
            )
        },
    }

    React.useEffect(() =>{
        functions.initializeState();
    }, [bannerUrl, pageAvatar, avatar]);
    
    return <>
        <div className="seller-profile__banner"></div>
        <Formik
            initialValues={{
                avatar: state.avatar instanceof File ? state.avatar : undefined,
                banner: state.banner instanceof File ? state.banner : undefined,
            } as SellerProfileImageInput}
            enableReinitialize={true}
            validationSchema={sellerChangeAvatar}
            onSubmit={(values: SellerProfileImageInput, formHelpers: FormikHelpers<SellerProfileImageInput>) => {
                formHelpers.setSubmitting(false);
                if(values?.avatar){
                    sellerAPIInstance.changeSellerAvatar(Number(userId), values.avatar)
                    .then(response =>{

                    }).catch(error => {
                        toast.error(error?.response?.status === 404 ? "Please enter profile information first" : error?.response?.data);
                    });
                }
            }}
        >
            {
                ({setFieldValue, handleSubmit, setErrors, ...props}) => {
                    return <>
                        {/* 1. Header */}
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
                                        background: `url(${state.avatar || defaultAvatar}) 0 / cover no-repeat`
                                    }}>
                                    {functions.toggleEditAvatar(editAvatar)}
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
                                    {functions.editOrSaveAvatarButton(editAvatar, handleSubmit)}
                                </div>
                            </Col>
                        </Row>

                        {/* Modal of Change Avatar Form */}
                        <Modal show={state.showCrop} backdrop="static" onHide={() => setState(o => ({...o, showCrop: false}))}>
                            <Modal.Header closeButton>
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <User.Thumb
                                    image={props.values.avatar || state.avatar ||null}
                                    setImage={(newImage: File) =>{
                                        transformImagetoString(newImage).then(value =>{
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
                                <Form.Control type={"file"}
                                    accept="image/*"
                                    isInvalid={!!props.errors?.["avatar"]}
                                    isValid={!props.errors.avatar}
                                    // value={(props.values?.avatar as File)?.webkitRelativePath}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const newAvatar = e.currentTarget.files?.item?.(0);
                                        sellerChangeAvatar.validate({ avatar: newAvatar }, {
                                            strict: true
                                        }).then(value =>{
                                            setErrors({
                                                avatar: ''
                                            });
                                            props.setValues({
                                                ...props.values,
                                                avatar: newAvatar as File
                                            });
                                        }).catch(error =>{
                                            setErrors({
                                                ...props?.errors,
                                                avatar: error.message
                                            });
                                        })
                                }}></Form.Control>
                                <Form.Control.Feedback type="invalid">{props.errors?.avatar}</Form.Control.Feedback>
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
    const {data: { email }} = useTypedSelector(s => s.auth);
    const {postSellerInfo} = useActions();
    const isFloatLeftLabel = useMediaQuery({
        query: '(max-width: 576px)' 
    });
    const location = useLocation();
    let navigate = useNavigate();

    return <>
        <Formik initialValues={{
                name: username,
                description: "",
                biography: "",
                userId: userId,
                phone: "",
                email: email
            }}
            enableReinitialize={true}
            validationSchema={sellerProfileCreationSchema}
            onSubmit={(values: FormValues, formHelpers: FormikHelpers<FormValues>) =>{
                formHelpers.setSubmitting(false);

                postSellerInfo(Number(userId),{
                    name: values.name,
                    description: values.description,
                    biography: values.biography,
                    phone: values.phone,
                    email: values.email,
                }, {
                    onSuccess: () =>{
                        if(location.pathname === "/sale/register"){
                            toast.success("Regitered profile successfully");
                            navigate("/sale", {
                                replace: true,
                            });
                        }
                        else{
                            toast.success("Updated profile");
                        }
                    },
                    onError: () => {
                        toast.error("Error updating profile");
                    }
                })

                // sellerAPIInstance.postSellerPage(Number(userId), values).then(response =>{

                // });
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
                                        <InputGroup.Text id="email">@</InputGroup.Text>
                                        <Form.Control name="email" 
                                            value={props.values.email}
                                            disabled
                                            isInvalid={props.touched.email && !!props.errors.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            aria-describedby="email"
                                        ></Form.Control>
                                        <Form.Control.Feedback type="invalid">{props.errors.email}</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} sm={2} controlId="userPageProfilePhone">
                                <Form.Label data-text-align={isFloatLeftLabel? "left":"right"} column sm={3} md={2}>Phone</Form.Label>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="name">+84</InputGroup.Text>
                                        <Form.Control name="phone" 
                                            value={props.values.phone}
                                            isInvalid={props.touched.phone && !!props.errors.phone}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            aria-describedby="name"
                                        ></Form.Control>
                                        <Form.Control.Feedback type="invalid">{props.errors.phone}</Form.Control.Feedback>
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