import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate ,Navigate, useSearchParams} from 'react-router-dom';
import {Formik, FormikHelpers, useFormikContext} from 'formik';
import {Form,Button,
    Spinner,Stack,Ratio,
    Modal,Toast,ToastContainer, 
    ProgressBar, ProgressBarProps, 
    ButtonGroup} from 'react-bootstrap';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useTypedSelector,useActions} from '../../hooks';
import {changeAvatarSchema, updateInfoSchema} from '../../schemas';
import {UpdateUserInfoRequest} from '../../models';
import {userAPIInstance} from '../../config';
import {Thumb} from './thumbnail';
import { CustomLink } from '../../components';
import { AiOutlineEdit } from 'react-icons/ai';
import "./index.css"
import { MdOutlineDone } from 'react-icons/md';
import { toast } from 'react-toastify';

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export const Profile = () => {
    const {data} = useTypedSelector(state => state.user);
    const [isModalShow, setModalShow] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    function openModal() {return setModalShow(true);}
    function closeModal(){ return setModalShow(false); }

    return (<>
        <Stack direction={"vertical"} 
        className="col-md-7 p-5 mx-auto align-items-md-center"
        style={{background: "#fff"}}
        gap={3}>
            <div className='profile__image'
                style={{
                    background: `url(${data.avatar || defaultAvatar}) center / contain no-repeat`
                }}
                onClick={openModal}>
                <div className="profile__icon--edit">
                    <AiOutlineEdit></AiOutlineEdit>
                </div>
            </div>

            <ImageEditor 
                isModalShow={isModalShow} 
                closeModal={closeModal}
            ></ImageEditor>

            {searchParams.get("isEdit")
            ? <EditableProfile></EditableProfile>
            : <React.Fragment>
                <PersonalBio></PersonalBio>
                <CustomLink to={{
                    pathname: '',
                    search: "isEdit=true"
                }}>
                    <Button variant="success" style={{background: 'var(--clr-logo)', width: '240px'}}>
                        Edit
                    </Button>
                </CustomLink>
            </React.Fragment>
            }
        </Stack>
    </>
    )
}

const ImageEditor = ({isModalShow,closeModal} : {
    isModalShow: boolean,
    closeModal: () => void
}) => {
    const {changeAvatar} = useActions();
    const {data,loading} = useTypedSelector(state => state.user);
    const [avatarProgress, setAvatarProgress] = useState<number>(0);


    function Footer(){
        const {submitForm} = useFormikContext();
        return <>
            <Button variant="secondary" onClick={closeModal}>
                Close
            </Button>
            <Button variant="primary" 
                onClick={submitForm} 
                disabled={loading}>{loading ? 
                <>
                    <Spinner as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"/>
                </>
                : "Save Changes"}</Button>
        </>
    }

    return (
        <Modal className='m-3' show={isModalShow} backdrop="static" onHide={closeModal} style={{minHeight:"80vh"}}>
            <Formik validationSchema={changeAvatarSchema}   
                initialValues={{file: data.avatar}}    
                onSubmit={(values: {file: any},formHelpers: FormikHelpers<{file: any}>)=>{
                    formHelpers.setSubmitting(false);
                    if(values.file instanceof File){
                        changeAvatar(values.file, {
                            onUploadProgress: (event:ProgressEvent)=>{
                                let percentage = Math.floor((event.loaded * 100) / event.total);
                                if(percentage <= 100){
                                    setAvatarProgress(percentage);
                                }
                            },
                            onSuccess: () =>{
                                toast.success("Done your avatar!");
                            },
                            onError: () =>{
                                toast.error("Failed on upload to server. Please try again!");
                            }
                        });
                    }
                }}>
                    {({values,errors, handleSubmit, setFieldValue, setErrors}) => {
                        return <>
                            <Modal.Header closeButton>
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>
                                    {loading 
                                    ? <div data-text-align="middle">
                                        <Ratio aspectRatio={"1x1"} style={{width: '120px', height: '120px'}}>
                                            <Spinner animation="border"></Spinner>
                                        </Ratio>
                                    </div>
                                    : <div>
                                        <Thumb image={values.file} 
                                            showCrop={true}
                                            roundedCircle
                                            styleThumb={{
                                                width: '120px',
                                                height: '120px',
                                                margin: '0 auto'
                                            }}
                                            styleCrop={{
                                                margin: '0 auto'
                                            }}
                                            setImage={(newImage) =>{
                                                setFieldValue("file", newImage);
                                            }}
                                            allowResize={false}
                                        ></Thumb>
                                    </div>
                                    }
                                    <Form.Control type="file" 
                                        name="file" 
                                        accept="image/*"
                                        aria-describedby="profileHelpBlock"
                                        isInvalid={!!values.file && !!errors.file}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                                            if(e.currentTarget.files !== null && e.currentTarget.files.length){
                                                changeAvatarSchema.validate({file: e.currentTarget.files[0]}).then(value => {
                                                    setFieldValue("file", value.file);
                                                }).catch(error =>{
                                                    setErrors({
                                                        file: error.message
                                                    })
                                                })
                                            }
                                    }}></Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>
                                    <Form.Text id="profileHelpBlock" muted>
                                        Your file should be less than 5 megabytes and format with .jpg / .png better
                                    </Form.Text>
                                    {avatarProgress > 0 && <ProgressAlert bodyText='Uploading your image...' progressProps={{now: avatarProgress, label: `${avatarProgress}%`}}></ProgressAlert>}
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Footer></Footer>
                            </Modal.Footer>           
                    </>}}
            </Formik>
        </Modal>
    )
}

export const ProgressAlert = ({progressProps ,style, onClose, bodyText}:{bodyText: string, progressProps: ProgressBarProps,style?: React.CSSProperties, onClose?: () => void}) =>{
    return <ToastContainer containerPosition='fixed' position={
        'bottom-end'
    } style={{...style}}>
        <Toast onClose={onClose}>
            <Toast.Header>
                <div>
                    {progressProps.now === 100 && <span className='p-2 me-3' style={{background: '#5fb00d', color: '#fff', borderRadius: '50%', display: 'inline-block', }}>
                        <span data-text-align="middle">
                            <MdOutlineDone></MdOutlineDone>
                        </span>
                    </span>}
                    {bodyText}
                </div>
            </Toast.Header>
            <Toast.Body>
                <ProgressBar {...progressProps} variant="success" style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"}}></ProgressBar>
            </Toast.Body>
        </Toast>
    </ToastContainer>
}

const PersonalBio = () =>{
    const {data: {email}} = useTypedSelector(state => state.auth);
    const {data: {userId,username}} = useTypedSelector(state => state.user);
    const [state, setState] = useState<UserInfoState>({
        loading: false,
        error: '',
        data: {
            biography: '',
            dateOfBirth: new Date()
        }
    });  
    const location = useLocation();

    useEffect(()=>{
        if(userId){
            setState(state => ({
                ...state,
                loading: true
            }));
            userAPIInstance.getUserInfo(userId).then((response: AxiosResponse)=>{
                if(response.data){
                    setState(oldState => ({
                        ...oldState,
                        data:{
                            ...oldState.data,
                            ...response.data
                        },
                        loading: false,
                        error: ''
                    }));
                }
            }).catch((error: Error | AxiosError | any) =>{
                let errorResponse = 'Failed';
                if(error instanceof AxiosError){
                    errorResponse = error!.response?.data as string || errorResponse;
                }
                setState(oldState => ({
                    ...oldState,
                    loading: false,
                    error: errorResponse
                }));
            });
        }
    },[userId]);
    if(state.error) return <Navigate to="/error" state={{from: location}}></Navigate>
    return <>
        <Form.Label>My DisplayName</Form.Label>
        <Form.Control type="disable" value={username} readOnly></Form.Control>

        <Form.Label>My Email</Form.Label>
        <Form.Control type="disable" value={email} readOnly></Form.Control>

        <Form.Label>Biography</Form.Label>
        <Form.Control type="disable" value={state.data.biography} readOnly></Form.Control>
    </>
}

const EditableProfile = () =>{
    const {updateUserInfo} = useActions();
    const navigate = useNavigate();

    return <Formik validationSchema={updateInfoSchema}
        initialValues={{
            organizationName: '',
            biography: '',
            dateOfBirth: (new Date()).toUTCString()
        }}
        onSubmit={(values: UpdateUserInfoRequest, formikHelpers: FormikHelpers<UpdateUserInfoRequest>) =>{
            updateUserInfo(values, {
                onSuccess: () =>{
                    toast.success("Updated your information");
                },
                onError: () =>{
                    toast.error("Failed on updating your information");
                }
            });
            formikHelpers.setSubmitting(false);
        }}>
        {({values, errors, touched, handleChange, handleSubmit}) =>{
            return (
            <Form onSubmit={handleSubmit} style={{width: '100%'}}>
                <Stack direction={"vertical"} 
                    gap={3}>
                    
                    <Form.Group controlId='organizationControl'>
                        <Form.Label>Organization name :</Form.Label>
                        <Form.Control name="organizationName" 
                        value={values.organizationName}
                        isInvalid={touched.organizationName && !!errors.organizationName}
                        onChange={handleChange}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.organizationName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='biographyControl'>
                        <Form.Label>Biography :</Form.Label>
                        <Form.Control as="textarea" name="biography" 
                        rows={5}
                        value={values.biography}
                        isInvalid={touched.biography && !!errors.biography}
                        onChange={handleChange}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.biography}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='dateOfBirthControl'>
                        <Form.Label>Date of company:</Form.Label>
                        <Form.Control type="date" 
                        name="dateOfBirth" 
                        value={values.dateOfBirth}
                        isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                        onChange={handleChange}></Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
                    </Form.Group>

                    <ButtonGroup>
                        <Button onClick={() => navigate({
                            pathname: "/account/profile"
                        })}>Back</Button>
                        <Button 
                            style={{
                                background: 'var(--clr-logo)'
                            }}
                            type={"submit"} 
                            variant='success'>Apply</Button>
                    </ButtonGroup>
                </Stack>
            </Form>
        )}}
    </Formik>
}



export interface UserInfoState {
    loading: boolean,
    error: string,
    data:{
        biography: string, 
        dateOfBirth: Date,  
    }
}
