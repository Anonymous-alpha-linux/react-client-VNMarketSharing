import { BrowserRouter, Route, Routes, Navigate , useLocation, Outlet} from "react-router-dom";
import {Account, Chat, User,Admin,AppNav} from './containers';
import {SellerPage, UserPage} from './pages';
import {useTypedSelector} from './hooks';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/*"} element={<AppNav.Navigation></AppNav.Navigation>}></Route>
                <Route path={"dashboard/*"} element={<span style={{width: '20%', backgroundColor: 'blue'}}>
                    <Admin.AdminLinksSidebar></Admin.AdminLinksSidebar>
                </span>}></Route>
                <Route path={"sale/*"} element={<AppNav.SellerNavbar></AppNav.SellerNavbar>}></Route>
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
                    <Route index element={<UserPage.ProductPage></UserPage.ProductPage>}></Route>
                </Route>

                <Route path="dashboard" element={<RouteGuard>
                    <span style={{width: '80%'}}>
                        <Outlet></Outlet>
                    </span>
                </RouteGuard>}>
                    <Route index element={<h1>DashBoard Admin</h1>}></Route>
                    <Route path="product" element={<UserPage.PostProduct></UserPage.PostProduct>}></Route>
                    <Route path="category" element={<Admin.Category></Admin.Category>}></Route>
                </Route>

                <Route path="account" element={<RouteGuard>
                        <UserPage.AccountPage>
                            <Outlet></Outlet>
                        </UserPage.AccountPage>
                    </RouteGuard>
                }>
                    <Route path="dashboard" element={<h1>Client Dashboard</h1>}></Route>

                    <Route path="profile" element={<User.Profile></User.Profile>}></Route>

                    <Route path="orders" element={<h1>Orders</h1>}></Route>

                    <Route path="address" element={<Outlet></Outlet>}>
                        <Route index element={<User.Address></User.Address>}></Route>
                        <Route path="create" element={<User.BillingAddressForm></User.BillingAddressForm>} ></Route>
                        <Route path="edit" element={<User.ShippingAddressForm></User.ShippingAddressForm>}></Route>
                        <Route path="select" element={<h1>Select Billing Address</h1>}></Route>
                    </Route>

                    <Route path="credit" element={<h1>Credit</h1>}></Route>
                </Route>

                <Route path="chat">
                    <Route index element={<RouteGuard>
                        <Chat.Channel></Chat.Channel>
                    </RouteGuard>}></Route>
                </Route>

                <Route path="service" element>
                    <Route path="collaborator" element={<h1>Service</h1>}></Route>
                </Route>

                <Route path="product" element={<Outlet></Outlet>}>
                    <Route index element={<h1>Product</h1>}></Route>
                    <Route path=":id" element={<UserPage.SingleItem></UserPage.SingleItem>}></Route>
                    <Route path="category" element={<UserPage.PostProduct></UserPage.PostProduct>}></Route>
                    <Route path="new" element={<UserPage.PostProduct></UserPage.PostProduct>}></Route>
                </Route>

                <Route path="sale" element={<AppNav.SellerSidebar>
                    <Outlet></Outlet>
                </AppNav.SellerSidebar>}>
                    <Route index element={<>
                        <h1>Props</h1>
                    </>}></Route>
                    <Route path="product" element={<Outlet></Outlet>}>
                        <Route index element={<UserPage.ProductTablePage></UserPage.ProductTablePage>}></Route>
                        <Route path="new" element={<UserPage.PostProduct></UserPage.PostProduct>}></Route>
                    </Route>
                    <Route path="page" element={<Outlet></Outlet>}>
                        <Route index element={<SellerPage.SellerProfile></SellerPage.SellerProfile>}></Route>
                    </Route>
                    <Route path="*" element={<h1>Not found</h1>}></Route>
                </Route>

                <Route path="admin"></Route>

                <Route path="page">
                    <Route index element={<UserPage.UserPage></UserPage.UserPage>}></Route>
                </Route>

                <Route path="/*"
                    element={<h1>404 Error: Page Not Found...</h1>}
                ></Route>
            </Routes>
        </BrowserRouter>
    )
}

function RouteGuard(props: {children: JSX.Element,roles?: Array<string>}){
    const {data} = useTypedSelector(state => state.auth); 
    const location = useLocation();

    if(!data.isAuthorized) return <Navigate to='/auth/login' state={{from: location}} replace></Navigate>
    if(props.roles && !props?.roles.includes(data.role)) return <Navigate to={'/'} replace></Navigate>
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

// const roles = ['admin', 'user']

export default Router