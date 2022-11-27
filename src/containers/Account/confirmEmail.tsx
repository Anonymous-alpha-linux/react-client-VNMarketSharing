import React from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { TiTick } from 'react-icons/ti';
import { Location, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CustomLink } from '../../components';
import {useActions} from "../../hooks";
import "./index.css";

export const ConfirmedEmail = React.memo(() => {
    const {confirmEmail} = useActions();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as {
        from: Location
    }
    const from = decodeURIComponent(searchParams.get("returnURL") || "%252F");;

    React.useEffect(()=>{
        const userId = searchParams.get("userId") || "";
        const token = searchParams.get("token") || "";
        if(!userId || !token){
            navigate("/auth/confirmEmail",{replace: true, state:{from: locationState}});
            return;
        }

        confirmEmail(userId, token);
    },[]);
    
    return <Container className="p-5 my-2" data-text-align="center" style={{minHeight: '80vh',border:'1px solid black'}}>
        <div className="email-confirm__paper">
            <span style={{border: '3px solid green', display: 'inline-block',borderRadius: '50%', color: 'green', width: '50px', height:'50px'}}>
                <div data-text-align="middle" style={{height:'100%', fontSize:'30px'}}>
                    <TiTick></TiTick>
                </div>
            </span>
            <h3 className='pt-5'>Your Account has been activated</h3>
            <span>You've been logged in system automatically</span>
            <div className="py-3">
                <Spinner animation="border"></Spinner>
            </div>
            <CustomLink to="/">
                <Button variant="secondary">Go to Home</Button>
            </CustomLink>
        </div>
    </Container>
});

export const NotConfirmedEmail = () => {
    return (
        <Container className="p-5" style={{minHeight:'80vh'}}>
            <div data-text-align="middle" className='email-confirm__paper p-4'>
                <h3 data-text-align="center">Please check email to confirm your access</h3>
                <h3 className="email-confirm__waiter" style={{textAlign: 'center'}}></h3>
                <div>
                    <CustomLink to="/auth/login">
                        <Button variant="secondary">Back to Login</Button>
                    </CustomLink>
                </div>
            </div>
        </Container>
    )
}