import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button,Image } from "react-bootstrap";

import {useTypedSelector,useActions} from '../../hooks';

const Sidebar = () => {
    const {loading,data} = useTypedSelector((state) => state.auth);

    return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
                <Link to="/">
                    <Navbar.Brand>
                            AdsMarketSharing
                    </Navbar.Brand>
                </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#features">About</Nav.Link>
                    <Nav.Link href="#pricing">Contact</Nav.Link>
                    <NavDropdown title="Services" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    {loading && <h4>{"Loading..."}</h4>}
                    {!data?.isAuthorized? 
                    <UnAuthorizedAction></UnAuthorizedAction>
                    : <ProfileTrigger></ProfileTrigger>}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}

const UnAuthorizedAction = () =>{
    return <span>
            <Link to="/auth/login"><Button variant='link'>Login</Button></Link> 
            <Link to="/auth/register"><Button size="sm">Register</Button></Link>
        </span>
}

const ProfileTrigger = () =>{
    const {logout} = useActions();

    function _logoutHandler() {
        logout();   
    }
    return <>
        <Image 
        roundedCircle 
        style={{

        }}
        src='https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg'
        width={"50px"} height={"50px"}>
        </Image>
        <Button onClick={_logoutHandler} variant="outline-info" size='sm'>Logout</Button>
    </>
}


export {Sidebar};