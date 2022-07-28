import React, { ChangeEvent, useEffect, useState } from 'react'
import {Formik, FormikFormProps, FormikHelpers, useFormikContext} from 'formik';
import {Form, Image,Button,Spinner,Stack, Ratio,Modal, Toast, ToastHeader, ToastBody, ToastContainer, ProgressBar, ProgressBarProps} from 'react-bootstrap';
import {useTypedSelector,useActions} from '../../hooks';
import {changeAvatarSchema} from '../../schemas';
import {Thumb} from './thumbnail';
const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export const Profile = () => {
    const {data,loading} = useTypedSelector(state => state.user);
    const [isModalShow, setModalShow] = useState<boolean>(false);
    const [isEditable, setEditable]  = useState<boolean>(false);

    function openModal() {return setModalShow(true);}
    function closeModal(){ return setModalShow(false); }

    if(isEditable) return <EditableProfile></EditableProfile>
    return (<>
        <Stack direction={"vertical"} 
        className="col-md-5 mx-auto align-items-md-center"
        gap={3}>
            {loading && <Ratio aspectRatio={"1x1"} style={{width: '120px', height: '120px'}}>
                <Spinner animation="border"></Spinner>
            </Ratio>
            || <Image rounded 
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
                                let percentage = Math.floor(event.loaded * 100 / event.total);
                                console.log(`${event.loaded} | ${event.total} | ${percentage}`);
                                setAvatarProgress(percentage);
                            }
                        });
                    }

                    formHelpers.setSubmitting(false);
                }}>
                    {({values, handleSubmit, setFieldValue}) => <>
                        <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <div style={{
                                }}>
                                    <Thumb image={values.file} setImage={(newImage) =>{ 
                                        setFieldValue("file", newImage);
                                    }}></Thumb>
                                </div>
                                <Form.Control type="file" name="file" 
                                accept="image/*"
                                aria-describedby="profileHelpBlock"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                                    if(e.currentTarget.files !== null && e.currentTarget.files.length){
                                        setFieldValue("file", e.currentTarget.files[0])
                                    }
                                }}></Form.Control>
                                <Form.Text id="profileHelpBlock" muted>
                                    Your file should be less than 5 megabytes and format with .jpg / .png better
                                </Form.Text>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Footer></Footer>
                        </Modal.Footer>
                    </>}
            </Formik>
            <ProgressAlert progressProps={{now: avatarProgress, label: `${avatarProgress}%`}} style={{
                zIndex: '100'
            }}></ProgressAlert>
        </Modal>
    )
}
const ProgressAlert = ({progressProps,style}:{progressProps: ProgressBarProps,style: React.CSSProperties}) =>{
    return <ToastContainer containerPosition='fixed' position='bottom-end' style={style}>
        <Toast>
            <Toast.Header></Toast.Header>
            <Toast.Body>
                <ProgressBar {...progressProps}></ProgressBar>
            </Toast.Body>
        </Toast>
    </ToastContainer>
}
const PersonalBio = () =>{
    return <>
        <Form></Form>
    </>
}
const EditableProfile = () =>{
    return (
        <div>
            Editable
        </div>
    )
}