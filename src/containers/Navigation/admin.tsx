import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";

import {useTypedSelector,useActions} from '../../hooks';

const Sidebar = () => {
    const {loading,data} = useTypedSelector((state) => state.auth);
    const {logout} = useActions();

    function _logoutHandler() {
        logout();
    }

    return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
            <Navbar.Brand>
                <Link to="/">
                    AdsMarketSharing
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                    <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <h4>{loading && "Loading..."}</h4>
                    {!data?.isAuthorized? 
                    <>
                        <Link to="/auth/login"><Button>Login</Button></Link> 
                        <Link to="/auth/register"><Button>Register</Button></Link>
                    </>
                    : <Button onClick={_logoutHandler}>Logout</Button>}
                
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}

export {Sidebar}