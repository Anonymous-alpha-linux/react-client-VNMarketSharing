import {NavLink} from 'react-router-dom';
import {Button,Nav} from 'react-bootstrap';

export {default as Login} from './login';
export {default as Register} from './register';
export * as EmailConfirmation from './confirmEmail';
export * from './changePassword';
export * from './sendEmailToChangePassword';

export function AccountLinks({children}: {children?:React.ReactNode }) {
    return <Nav defaultActiveKey="/account/dashboard" className="flex-column">
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
            </Nav>
}