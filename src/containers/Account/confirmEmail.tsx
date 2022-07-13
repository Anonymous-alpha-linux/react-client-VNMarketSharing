import React from 'react';
import { Location, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {useActions, useTypedSelector} from "../../hooks";

export const ConfirmedEmail = React.memo(() => {
    const {confirmEmail} = useActions();
    const {error} = useTypedSelector(state => state.auth);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as {
        from: Location
    }
    const from = decodeURIComponent(searchParams.get("returnURL")|| "%252F");;

    React.useEffect(()=>{
        const userId = searchParams.get("userId") || "";
        const token = searchParams.get("token") || "";

        if(!userId || !token){
            navigate("/auth/confirmEmail",{replace: true,state:{from: locationState}})
        }
        confirmEmail(userId, token);
    },[]);

    if(error){
        return <Navigate to={"/auth/confirmEmail"} state={{from: location}} replace></Navigate>
    } 
    return <Navigate to={from} state={{from: location}} replace></Navigate>
});

export const NotConfirmedEmail = () => {
    return (
        <>
            <div>Please check email to confirm your access</div>
            <h3 style={{textAlign: 'center'}}>...</h3>
        </>
    )
}