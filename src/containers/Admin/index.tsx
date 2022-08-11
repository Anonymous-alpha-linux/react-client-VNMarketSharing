import { Nav,Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export * from './category';
export const AdminLinksSidebar:React.FC<{}>= () => {
    return <Nav defaultActiveKey="/dashboard" className="flex-column">
        <Nav.Item>
            <NavLink to="/dashboard">Dashboard</NavLink>
        </Nav.Item>
        <Nav.Item>
            <NavLink to="/dashboard/category">Category</NavLink>
        </Nav.Item>
        <Nav.Item>
            <NavLink to="/dashboard/product">Product</NavLink>
        </Nav.Item>
        <Nav.Item>
            <Button>Logout</Button>
        </Nav.Item>
    </Nav>
}
