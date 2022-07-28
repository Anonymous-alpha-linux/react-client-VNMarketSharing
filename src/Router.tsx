
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate ,Outlet, useLocation} from "react-router-dom";
import {Navigation, Sidebar,Account} from './containers';
import {Layout} from './pages';
import {useTypedSelector} from './hooks';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/*"} element={<Navigation></Navigation>}></Route>
                <Route path={"dashboard/*"} element={<Sidebar></Sidebar>}></Route>
            </Routes>
            <Routes>
                <Route path="auth">
                    <Route path="login" element={
                        <RouteAuth>
                            <Account.Login></Account.Login>
                        </RouteAuth>
                    }></Route>
                    <Route path="register" element={
                        <RouteAuth>
                            <Account.Register></Account.Register>
                        </RouteAuth>
                    }></Route>
                    <Route path="confirmEmail">
                        <Route index element={<RouteAuth> 
                            <Account.EmailConfirmation.NotConfirmedEmail></Account.EmailConfirmation.NotConfirmedEmail>
                        </RouteAuth>}></Route>
                        <Route path="redirect" element={
                            <RouteAuth>
                                <Account.EmailConfirmation.ConfirmedEmail></Account.EmailConfirmation.ConfirmedEmail>
                            </RouteAuth>
                        }></Route>
                    </Route>
                    <Route path="confirm/changePassword" element={<RouteAuth>
                        <Account.SendEmailToChangePassword></Account.SendEmailToChangePassword>
                    </RouteAuth>}>
                    </Route>
                    <Route path="changePassword">
                        <Route index element={<RouteAuth>
                            <Account.ChangePassword></Account.ChangePassword>
                        </RouteAuth>}></Route>
                    </Route>
                </Route>

                <Route path="/">
                    <Route index element={<h1>Welcome</h1>}></Route>
                    <Route path="protect" element={<RouteGuard>
                        <h2>Something is secrete</h2>
                    </RouteGuard>}></Route>
                    <Route path="public" element={<h2>Public</h2>}></Route>
                </Route>

                <Route path="service" element>
                    <Route path="collaborator" element={<h1>Service</h1>}></Route>
                </Route>

                <Route path="/*"
                    element={<h1>404 Error: Page Not Found...</h1>}
                ></Route>
            </Routes>
        </BrowserRouter>
    )
}

function RouteGuard(props: {children: JSX.Element}){
    const {data} = useTypedSelector(state => state.auth); 
    const location = useLocation();

    if(!data.isAuthorized) return <Navigate to='/auth/login' state={{from: location}} replace></Navigate>
    return (props.children);
}

const RouteAuth = (props: {children: JSX.Element}) => {
    const {data} = useTypedSelector(state => state.auth); 
    const location = useLocation();
    const locationState = location.state as {
        from?: Location
    };

    if(data.isAuthorized) return <Navigate to={locationState?.from?.pathname || "/"} replace></Navigate>
    return props.children;
}

export default Router