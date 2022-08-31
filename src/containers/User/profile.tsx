import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate ,Navigate} from 'react-router-dom';
import {Formik, FormikHelpers, useFormikContext} from 'formik';
import {Form,Image,Button,
    Spinner,Stack,Ratio,
    Modal,Toast,ToastContainer, 
    ProgressBar, ProgressBarProps, ButtonGroup} from 'react-bootstrap';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useTypedSelector,useActions} from '../../hooks';
import {changeAvatarSchema, updateInfoSchema} from '../../schemas';
import {UpdateUserInfoRequest} from '../../models';
import {userAPIInstance} from '../../config';
import {Thumb} from './thumbnail';

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export const Profile = () => {
    const {data,loading} = useTypedSelector(state => state.user);
    const [isModalShow, setModalShow] = useState<boolean>(false);
    const [isEditable, setEditable]  = useState<boolean>(false);

    function openModal() {return setModalShow(true);}
    function closeModal(){ return setModalShow(false); }

    return (<>
        <Stack direction={"vertical"} 
        className="col-md-5 mx-auto align-items-md-center"
        gap={3}>
            {loading ? <Ratio aspectRatio={"1x1"} style={{width: '120px', height: '120px'}}>
                <Spinner animation="border"></Spinner>
            </Ratio>
            : <Image rounded 
                fluid 
                roundedCircle  
                style={{
                    width:'120px',
                    height: '120px'
                }}
                onClick={openModal}
                src={data.avatar || defaultAvatar}>
            </Image>}

            <ImageEditor isModalShow={isModalShow} 
            closeModal={closeModal}></ImageEditor>

            {isEditable? <EditableProfile></EditableProfile>: 
            <PersonalBio></PersonalBio>}

            {!isEditable && <Button onClick={() => {
                            setEditable(s => !s);
                        }}>
                            Edit
                        </Button>
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
        <Modal show={isModalShow} onHide={closeModal}>
            <Formik validationSchema={changeAvatarSchema}   
                initialValues={{file: data.avatar}}    
                onSubmit={(values: {file: any},formHelpers: FormikHelpers<{file: any}>)=>{
                    if(values.file instanceof File){
                        changeAvatar(values.file, {
                            onUploadProgress: (event:ProgressEvent)=>{
                                let percentage = Math.floor((event.loaded * 100) / event.total);
                                
                                if(percentage < 100){
                                    setAvatarProgress(percentage);
                                }
                            }
                        });
                    }

                    formHelpers.setSubmitting(false);
                }}>
                    {({values,errors, handleSubmit, setFieldValue, setErrors}) => {
                        return <>
                            <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>
                                    <div style={{
                                    }}>
                                        <Thumb image={values.file} 
                                            showCrop={true}
                                            roundedCircle
                                            setImage={(newImage) =>{
                                                setFieldValue("file", newImage);
                                            }}
                                        ></Thumb>
                                    </div>
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
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Footer></Footer>
                            </Modal.Footer>
                    </>}}
            </Formik>
            {avatarProgress > 0 && <ProgressAlert progressProps={{now: avatarProgress, label: `${avatarProgress}%`}}></ProgressAlert>}
        </Modal>
    )
}
const ProgressAlert = ({progressProps,style}:{progressProps: ProgressBarProps,style?: React.CSSProperties}) =>{
    return <ToastContainer containerPosition='fixed' position='bottom-end' style={style}>
        <Toast>
            <Toast.Header>
                <h1>Upload Processing</h1>
            </Toast.Header>
            <Toast.Body>
                <ProgressBar {...progressProps}></ProgressBar>
            </Toast.Body>
        </Toast>
    </ToastContainer>
}
export interface UserInfoState {
    loading: boolean,
    error: string,
    data:{
        biography: string, 
        dateOfBirth: Date,  
    }
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
    if(state.loading) return <Spinner animation='border'>...</Spinner>
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
            updateUserInfo(values);
            formikHelpers.setSubmitting(false);
        }}>
        {({values, errors, touched, handleChange, handleSubmit}) =>{
            return (
            <Form onSubmit={handleSubmit}>
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
                    <Form.Control name="biography" 
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
                    <Button onClick={() => navigate(-1)}>Back</Button>
                    <Button type={"submit"} variant='success'>Apply</Button>
                </ButtonGroup>
            </Form>
        )}}
    </Formik>
}