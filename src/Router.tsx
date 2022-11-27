import React from 'react';
import { BrowserRouter, Route, Routes, Navigate , useLocation, Outlet, useNavigate} from "react-router-dom";
import {Account, Chat, User,Admin,AppNav, Footer} from './containers';
import {AdminPage, SellerPage, UserPage} from './pages';
import {useTypedSelector} from './hooks';
import { Container, Spinner } from "react-bootstrap";
import { sellerAPIInstance } from './config'
import { ResponseStatus } from './models';

const roles = ['Administrator', 'User', 'Merchant']

function Router() {
    return (
        <BrowserRouter>
            {/* 1. Header */}
            <Routes>
                <Route path={"/*"} element={<AppNav.Navigation></AppNav.Navigation>}></Route>
                <Route path={"admin/*"} element={<span style={{width: '20%', backgroundColor: 'blue'}}>
                    <AppNav.AdminNavbar></AppNav.AdminNavbar>
                </span>}></Route>
                <Route path={"sale/*"} element={<AppNav.SellerNavbar></AppNav.SellerNavbar>}></Route>
            </Routes>

            {/* 2. Body */}
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
                            <>
                                <Account.EmailConfirmation.ConfirmedEmail></Account.EmailConfirmation.ConfirmedEmail>
                            </>
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
                    <Route path="*" element={<Container className="p-5">
                        <h3 data-text-align="center">
                            Empty page
                        </h3>
                    </Container>}></Route>
                </Route>

                <Route path="/" element={<>
                    <Outlet></Outlet>
                </>}>
                    <Route index element={<UserPage.ProductPage></UserPage.ProductPage>}></Route>
                    <Route path="product" element={<Outlet></Outlet>}>
                        <Route index element={<UserPage.ProductFilter></UserPage.ProductFilter>}></Route>
                        <Route path=":id" element={<UserPage.SingleProduct></UserPage.SingleProduct>}></Route>
                    </Route>

                    <Route path="checkout" element={<Outlet></Outlet>}>
                        <Route index element={<UserPage.CheckoutPage></UserPage.CheckoutPage>}></Route>
                        <Route path="status" element={<UserPage.CheckoutSuccessPage></UserPage.CheckoutSuccessPage>}></Route>
                    </Route>

                    <Route path="cart" element={<Outlet></Outlet>}>
                        <Route index element={<UserPage.CartPage></UserPage.CartPage>}></Route>
                    </Route>
                </Route>

                <Route path="account" element={<RouteGuard>
                        <UserPage.AccountPage>
                            <Outlet></Outlet>
                        </UserPage.AccountPage>
                    </RouteGuard>
                }>
                    <Route path="dashboard" element={<h1>Client Dashboard</h1>}></Route>

                    <Route path="profile" element={<User.Profile></User.Profile>}></Route>

                    <Route path="orders" element={<Outlet></Outlet>}>
                        <Route index element={<UserPage.OrderShow></UserPage.OrderShow>}></Route>
                        <Route path=":id" element={<Outlet></Outlet>}>
                            <Route index element={<UserPage.StepFormPage></UserPage.StepFormPage>}></Route>
                        </Route>
                    </Route>

                    <Route path="address" element={<Outlet></Outlet>}>
                        <Route index element={<User.Address></User.Address>}></Route>
                        <Route path="create" element={<User.AddressCreationForm></User.AddressCreationForm>} ></Route>
                        <Route path="edit" element={<User.AddressUpdateForm></User.AddressUpdateForm>}></Route>
                        <Route path="select" element={<h1>Select Billing Address</h1>}></Route>
                    </Route>

                    <Route path="credit" element={<div>You didn't have credit now</div>}></Route>
                </Route>

                <Route path="orders/:id/track" element={<UserPage.OrderTrackerPage></UserPage.OrderTrackerPage>}></Route>

                <Route path="chat">
                    <Route index element={<RouteGuard>
                        <Chat.Channel></Chat.Channel>
                    </RouteGuard>}></Route>
                </Route>

                {/* Seller */}
                <Route path="sale" element={
                    <SellerAuth>
                        <RouteGuard roles={roles}>
                            <AppNav.SellerSidebar>
                                <Outlet></Outlet>
                            </AppNav.SellerSidebar>
                        </RouteGuard>
                    </SellerAuth>}
                >
                    <Route index element={<div className="ps-2">
                        <h3>Dashboard seller</h3>
                    </div>}></Route>
                    <Route path="product" element={<>
                        <Outlet></Outlet>
                    </>}>
                        <Route index element={<UserPage.ProductTablePage></UserPage.ProductTablePage>}></Route>
                        <Route path="new" element={<UserPage.PostProductForm></UserPage.PostProductForm>}></Route>
                    </Route>
                    <Route path="page" element={<Outlet></Outlet>}>
                        <Route index element={<SellerPage.SellerProfile></SellerPage.SellerProfile>}></Route>
                    </Route>
                    <Route path="invoice" element={<Outlet></Outlet>}>
                        <Route index element={<SellerPage.InvoiceShow></SellerPage.InvoiceShow>}></Route>
                        <Route path=":id" element={<SellerPage.OrderShow></SellerPage.OrderShow>}></Route>
                    </Route>
                    <Route path="order" element={<Outlet></Outlet>}>
                        <Route index element={<h3>Order</h3>}></Route>
                        <Route path=":id" element={<h3>Single Order list</h3>}></Route>
                    </Route>
                    <Route path="expense"></Route>
                    <Route path="*" element={<h2>Not found</h2>}></Route>
                </Route>
                {/* Go to when user doesn't register as merchant role */}
                <Route path="sale/register" element={<SellerPage.SellerProfile></SellerPage.SellerProfile>}></Route>

                {/* Admin */}
                <Route path="admin" element={<RouteGuard roles={['Administrator']}>
                    <Admin.AdminLinksSidebar>
                        <Outlet></Outlet>
                    </Admin.AdminLinksSidebar>
                </RouteGuard>}>
                    <Route index path="dashboard" element={<AdminPage.DashboardPage></AdminPage.DashboardPage>}></Route>
                    <Route path="product" element={<AdminPage.ProductInspectPage></AdminPage.ProductInspectPage>}></Route>
                    <Route path="category" element={<AdminPage.CategoryTablePage></AdminPage.CategoryTablePage>}></Route>
                    <Route path="seller" element={<AdminPage.SellerTable></AdminPage.SellerTable>}></Route>
                    <Route path="user" element={<AdminPage.UserTablePage></AdminPage.UserTablePage>}></Route>
                    <Route path="block" element={<AdminPage.BlockTablePage></AdminPage.BlockTablePage>}></Route>
                    <Route path="notify" element={<AdminPage.NotificationPage></AdminPage.NotificationPage>}></Route>
                    <Route path="*" element={<h2>404 Not Found</h2>}></Route>
                </Route>

                <Route path="page">
                    <Route index element={<UserPage.UserMain></UserPage.UserMain>}></Route>
                </Route>

                <Route path="/*"
                    element={<h1>404 Error: Page Not Found...</h1>}
                ></Route>
            </Routes>

            {/* 3. Footer */}
            <Routes>
                <Route path="sale/*" element={<></>}></Route>
                <Route path="admin/*" element={<></>}></Route>
                <Route path="/*" element={<Footer.User></Footer.User>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export function RouteGuard(props: {children: JSX.Element,roles?: string[]}){
    const {data} = useTypedSelector(state => state.auth); 
    const location = useLocation();

    function validateRoles(roles: string[], authorizes: string[]):boolean {
        return authorizes.some((role) => {
            return roles.some(irole => {
                // console.log(`${role}===${irole}?`, role === irole);
                return role === irole;
            });
        });
    }

    if(!data.isAuthorized) return <Navigate to='/auth/login' state={{from: location}} replace></Navigate>
    if(props?.roles && !validateRoles(props.roles, data.roles)) return (<Navigate to={'/'} replace></Navigate>)
    return (props.children);
}

const RouteAuth = (props: {children: JSX.Element}) => {
    const {data} = useTypedSelector(state => state.auth); 
    const location = useLocation();
    const locationState = location.state as {
        from?: Location
    };

    if(data.isAuthorized) return (<Navigate to={locationState?.from?.pathname || "/"} replace></Navigate>)

    return props.children;
}

const SellerAuth = (props: {children: JSX.Element}) => {
    const {data, status, loading} = useTypedSelector(p => p.seller);
    const [isAllowed, setIsAllowed] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() =>{
        if(status === ResponseStatus.FAILED){
            navigate("/sale/register", {
                replace: true,
            });
            return;
        }
        else if(data.id){
            setIsAllowed(true);
            return;
        }
    },[data]);

    if(loading) return (
        <Container className="p-5" data-text-align="middle">
            <Spinner animation="border"></Spinner>
        </Container>
    )

    return <>
        {isAllowed && props.children}
    </>
}



export default Router