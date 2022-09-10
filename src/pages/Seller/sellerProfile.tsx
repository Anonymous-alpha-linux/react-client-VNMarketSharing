import React from 'react';
import { Formik } from "formik";
import { Row, Col, Button } from "react-bootstrap";
import { AiFillEdit } from 'react-icons/ai';
import { RiEdit2Line } from 'react-icons/ri';
import { string } from "yup";
import { useTypedSelector } from "../../hooks";
import "./index.css";
import { SellerProfileCreationProps, SellerProfileCreationState } from "./seller";

export const SellerProfile = () => {
    const {data: {avatar, username}} = useTypedSelector(state => state.user);

    // Get the page of seller

    return <>
        <section className="p-3">
            <h2>Shop Profile</h2>
            <section className="seller-profile__header">
                <div className="seller-profile__banner"></div>
                <Row md={2} 
                    lg={3}
                className="mb-2"
                style={{
                    position: 'relative',
                    alignItems: 'flex-end'
                }}>
                    <Col sm={"auto"}
                        md={3}
                        lg={3}
                        style={{
                            textAlign: "right",
                        }}>
                        <div className="seller-profile__avatar" style={{
                            background: `url(${avatar}) 0% 0% / contain`
                        }}>
                            <span className="seller-profile__avatar--edit">
                                <RiEdit2Line></RiEdit2Line>
                            </span>
                        </div>
                    </Col>
                    <Col sm={8} md={"auto"} lg={6} className="pb-3">
                        <h4 className="seller-profile__text--name">{username}</h4>
                        <i className="seller-profile__text--sologan"
                        style={{
                            
                        }}>Update Your Photo and Personal Details</i>
                    </Col>
                    <Col lg={3} className="mt-3">
                        <div className="seller-profile__header--buttons">
                            <Button className="px-5" style={{background: "var(--clr-logo)"}}>Save</Button>
                            {" "}
                            <Button className="px-5" style={{background: '#637381'}}>Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </section>

            <section className="seller-profile__header">

            </section>
        </section>
    </>
}

type FormValues = {
    name: string;
    description: string;
    bannerUrl?: File;
    biography: string;
    userId: number;
}

const SellerProfileCreation = (props: SellerProfileCreationProps) =>{
    const [state, setState] = React.useEffect<SellerProfileCreationState>({});

    return <>
        <Formik initialValues={{
            name: "",
            description: "",
            bannerUrl: ,
            biography: string,
            userId: number
        }}
            validationSchema={}
            onSubmit={(values, formHelpers) =>{
                formHelpers.setSubmitting(false);
            }}>

        </Formik>
    </>
}