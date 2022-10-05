import {NavLink} from 'react-router-dom';
import {Button,Nav} from 'react-bootstrap';
import { Sidebar } from '../../components';
import { MdDashboard, MdGpsFixed } from 'react-icons/md';
import { BiArrowToRight } from 'react-icons/bi';
import { HiCreditCard } from 'react-icons/hi';
import { BsFillCartCheckFill, BsFillFilePersonFill } from 'react-icons/bs';

export {default as Login} from './login';
export {default as Register} from './register';
export * as EmailConfirmation from './confirmEmail';
export * from './changePassword';
export * from './sendEmailToChangePassword';

export function AccountLinks({children}: {children?:React.ReactNode }) {
    return <>
        <Sidebar 
        show={true}
        styleContainer={{
            position: 'relative',
            top:'initial',
            height: '100%',
            zIndex: 99,
            minHeight: '80vh'
        }}
        data={[
            {
                title: "Dashboard",
                path: '/account/dashboard',
                icon: <MdDashboard></MdDashboard>,
                iconClosed: <BiArrowToRight></BiArrowToRight>,
                iconOpened: <BiArrowToRight></BiArrowToRight>,
            },
            {
                title: "Orders",
                path: '/account/orders',
                icon: <BsFillCartCheckFill></BsFillCartCheckFill>,
                iconClosed: <BiArrowToRight></BiArrowToRight>,
                iconOpened: <BiArrowToRight></BiArrowToRight>,
            },
            {
                title: "Account Details",
                path: '/account/profile',
                icon: <BsFillFilePersonFill></BsFillFilePersonFill>,
                iconClosed: <BiArrowToRight></BiArrowToRight>,
                iconOpened: <BiArrowToRight></BiArrowToRight>,
            },
            {
                title: "Addresses",
                path: '/account/address',
                icon: <MdGpsFixed></MdGpsFixed>,
                iconClosed: <BiArrowToRight></BiArrowToRight>,
                iconOpened: <BiArrowToRight></BiArrowToRight>,
            },
            {
                title: "Credit",
                path: '/account/credit',
                icon: <HiCreditCard></HiCreditCard>,
                iconClosed: <BiArrowToRight></BiArrowToRight>,
                iconOpened: <BiArrowToRight></BiArrowToRight>,
            },
        ]}></Sidebar>
        {/* <Nav defaultActiveKey="/account/dashboard" className="flex-column">
            <Nav.Item>
                <NavLink to="/account/dashboard">Dashboard</NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/account/orders">Orders</NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/account/profile">Account Details</NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/account/address">Addresses</NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/account/credit">Credit</NavLink>
            </Nav.Item>
            <Nav.Item>
                <Button>Logout</Button>
            </Nav.Item>
        </Nav> */}
    </>
}