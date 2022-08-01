import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button,ButtonGroup,Image, Dropdown, Modal, Spinner } from "react-bootstrap";

import {useTypedSelector,useActions} from '../../hooks';
import { CustomLink } from '../../components';

const Navigation = () => {
    const {loading, data} = useTypedSelector((state) => state.auth);

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
                    <Nav.Link as="span">
                        <CustomLink to={"/about"}>
                            About
                        </CustomLink>
                    </Nav.Link>
                    <Nav.Link as="span">
                        <CustomLink to={"/production"}>
                            Production
                        </CustomLink>
                    </Nav.Link>
                    <Nav.Link as="span">
                        <CustomLink to={"/contact"}>
                            Contact
                        </CustomLink>
                    </Nav.Link>
                    <NavDropdown title="Services" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Advertisment</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Store Banner</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Ecommerce</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.3">Become our collaborator</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.4">Order management</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as="span">
                        <CustomLink to={"/pricing"}>
                            Pricing
                        </CustomLink>
                    </Nav.Link>
                </Nav>
                <Nav className="align-items-center" variant='pills'>
                    {loading && <Spinner animation="border"></Spinner>}
                    {!data?.isAuthorized? 
                    <UnAuthorizedAction></UnAuthorizedAction>
                    : <ProfileTrigger user={data.email}></ProfileTrigger>}
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

const ProfileTrigger : React.JSXElementConstructor<{user: string}>= ({user}) =>{
    const {logout,getUserInfo} = useActions();
    const {data: {email}} = useTypedSelector(state => state.auth);
    const {data} = useTypedSelector(state => state.user);
    const defaultImage = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

    React.useEffect(()=>{
        getUserInfo();
    },[email]);

    function _logoutHandler() {
        logout();   
    }
    
    return <>
        <Dropdown as={ButtonGroup} size='sm'>
            <Dropdown.Toggle split variant="link" id="dropdown-split-basic" size="sm" style={{padding: 0}}>
                <Link to="/profile">
                    <Image
                    roundedCircle 
                    src={data.avatar || defaultImage}
                    width={"50px"} height={"50px"}>
                    </Image>
                </Link>
                <Navbar.Text>Hello, {data.username.substring(0,5)}...</Navbar.Text>
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul">
                <Dropdown.Item as="li" className="align-middle">
                    <Link to="/account/profile">
                        Profile
                    </Link>                   
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <Link to="/account/dashboard">
                        My work
                    </Link>                   
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <Link to="/chat">
                        Message
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <Link to="/notify">
                        Notification
                    </Link>
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item as="li" className="align-middle" onClick={_logoutHandler}>
                    Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    </>
}


export {Navigation};