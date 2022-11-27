import {NavLink} from 'react-router-dom';
import {Button,Nav} from 'react-bootstrap';
import { Sidebar } from '../../components';
import { MdDashboard, MdGpsFixed } from 'react-icons/md';
import { BiArrowToRight } from 'react-icons/bi';
import { HiCreditCard } from 'react-icons/hi';
import { BsFillCartCheckFill, BsFillFilePersonFill } from 'react-icons/bs';
import { screenType, useResponsive } from '../../hooks';

export {default as Login} from './login';
export {default as Register} from './register';
export * as EmailConfirmation from './confirmEmail';
export * from './changePassword';
export * from './sendEmailToChangePassword';

export function AccountSidebarLinks({children}: {children?:React.ReactNode }) {
    const screen = useResponsive();

    return <>
        <Sidebar 
            show={true}
            styleContainer={{
                height: screen > screenType["medium"] ? '100vh' : undefined,
                minHeight: screen >=screenType["medium"] ? '80vh' : undefined,
                top: screen >=screenType["medium"] ? '118px' : '140px',
                display: screen > screenType["medium"] ? "inline-block" : undefined,
                zIndex: screen <= screenType["mobile"] ? 105 : 99,
            }}
            styleToggle={{
                top: 'unset',
                bottom: '20px',
                left: '20px',
                padding: '12px',
                fontSize: '1.5rem'
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
            ]}>
            {children}
        </Sidebar>
    </>
}