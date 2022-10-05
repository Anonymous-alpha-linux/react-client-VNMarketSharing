import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button, ButtonGroup, Image, Dropdown, Spinner, Badge, Offcanvas, Row, Col, OffcanvasProps } from "react-bootstrap";
import { FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

import { useTypedSelector, useActions, useDebouncedInput } from '../../hooks';
import { CustomLink, Input, Logo, Rating } from '../../components';
import './index.css';
import { useMediaQuery } from 'react-responsive';
import { GetProductResponseDTO } from '../../models';

const defaultImage = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

interface UserNavigationRouteState {
    categoryId: number;
}

const Navigation = () => {
    const { loading, data } = useTypedSelector((state) => state.auth);
    const {data: { categoryList }} = useTypedSelector(s => s.category);
    const isMobileScreen = useMediaQuery({
        query: '(max-width:575px)'
    });
    return <>
        <Navbar className="navigation__top px-5">
            <Container fluid style={{justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <Link to="/">
                    <Navbar.Brand>
                        <Logo></Logo>
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
                            <CustomLink to={{
                                pathname: "/product",
                                search: `?category_id=${categoryList?.at(0)?.id}`,
                                hash: `#${categoryList?.at(0)?.name}`,
                            }}>
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Navbar className="navigation__middle px-5"
        collapseOnSelect 
        expand="lg" 
        bg="dark" 
        variant="dark">
            <Container fluid style={{justifyContent: 'space-between'}}>
                <Searchbar isOpened={isMobileScreen}></Searchbar>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav className="align-items-center" variant='pills'>
                        {loading && <Spinner animation="border"></Spinner>}
                        {!data?.isAuthorized ?
                            <UnAuthorizedAction></UnAuthorizedAction>
                            : <ProfileTrigger user={data.email}></ProfileTrigger>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Navbar className="navigation__bottom px-5 justify-content-center">
            <Container fluid style={{justifyContent: 'flex-start', margin: '0 auto', flexBasis:'120px'}}>
                {categoryList.filter(category => category.level === 0).map(category =>{
                    return <span key={category.id} className="navigation__bottom--item">
                        <CustomLink to={{
                            pathname: "/product",
                            search: `?category_id=${category.id}`,
                            hash: `#${category.name}`,
                        }}
                        state={{
                                categoryId: category.id,
                                fromNavigation: true
                            } as UserNavigationRouteState}
                        style={{
                            color: 'inherit',
                            display:"inline-block"
                        }}>
                            {category.name}
                        </CustomLink> 
                    </span>
                })}
            </Container>
        </Navbar>
    </>
}

const Searchbar = (props:{isOpened?: boolean}) => {
    const {data: {productList}} = useTypedSelector(s => s.product);
    const [open, setOpen] = React.useState<boolean>(!!props.isOpened);
    const [results, setResult] = React.useState<GetProductResponseDTO[]>([]);
    const [input, setInput] = useDebouncedInput("");
    
    React.useEffect(() =>{
        if(input) {
            searchProductList();
            return;
        }
        setResult([]);
    },[open])

    React.useEffect(() =>{
        if(!input){
            setResult([]);
            return;
        }
        searchProductList();
    },[input]);

    function searchProductList(){
        const searchItems = productList.filter(p => {
            const foundString = p.name.toLowerCase().search(input.toLowerCase()) > -1 
                                || p.productCategories.some(pc => pc.name.toLowerCase().search(input.toLowerCase()) > -1);       
            return foundString;
        });
        setResult(searchItems);
    }

    return <div className='search__root'>
        <div className="search__container" 
            onClick={() =>{
                if(!open){
                    setOpen(true);
                    
                }
            }}
            aria-pressed={open}>
            <div className="search__icon"></div>
            <div className="search__input">
                <input placeholder="Search your product..." value={input} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}></input>
            </div>
            <span style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                right: '15px',
                transform: 'translateY(-50%)'
            }}>
                <span className="search__close" aria-hidden={!open} onClick={() => setOpen(false)}>
                </span>
            </span>
        </div>
        <div className="search__completion" aria-hidden={!open || !results.length}>
            {
                results.map((result,index) =>{
                    return <SearchItem key={index} product={result}></SearchItem>
                })
            }
            <span className="search__completion--match">
                {`We found ${results.length} matches`}
            </span>
        </div>
    </div>
}

const SearchItem = (props: {product: GetProductResponseDTO}) => {
    return <>
        <Row gap={2} className={"searchItem__container"}>
            <Col sm={"auto"}>
                <div style={{
                    background: `url(${props.product.urls[0] || defaultImage}) center / 100% no-repeat`,
                    width:"120px",
                    height:'120px'
                }}>

                </div>
                {/* <img src={props.product.urls[0] || defaultImage} width={"120px"} height={"120px"}></img> */}
            </Col>
            <Col>
                <div className="py-3">
                    <CustomLink to={`/product/${props.product.id}`}>
                        <h4 className="searchItem__title--name" title={props.product.name}>{props.product.name}</h4>
                    </CustomLink>
                    <div>{props.product.price}</div>
                    <div><Rating.Star percentage={0.7}></Rating.Star></div>
                </div>
            </Col>
        </Row>
    </>
}

const UnAuthorizedAction = () => {
    return <span>
        <Link to="/auth/login"><Button variant='link'>Login</Button></Link>
        <Link to="/auth/register"><Button size="sm">Register</Button></Link>
    </span>
}

const ProfileTrigger: React.JSXElementConstructor<{ user: string }> = ({ user }) => {
    const { logout, getUserInfo } = useActions();
    const { data: { email } } = useTypedSelector(state => state.auth);
    const { data } = useTypedSelector(state => state.user);
    const { data: { totalAmount } } = useTypedSelector(state => state.cart);
    const [state, setState] = React.useState<{
        showOffCanvas: boolean;
    }>({
        showOffCanvas: false
    });

    React.useEffect(() => {
        getUserInfo();
    }, [email]);

    function toggleOffCanvas() {
        setState(o => ({
            ...o,
            showOffCanvas: !o.showOffCanvas
        }))
    }

    return <>
        <div style={{
                color: "var(--clr-logo)",
                marginRight: '12px',
                cursor: 'pointer',
                fontSize: "1.6rem",
                position: 'relative'
            }}>
            <FaHeart></FaHeart>
        </div>

        <div
            onClick={() => toggleOffCanvas()}
            style={{
                color: "#fff",
                marginRight: '12px',
                cursor: 'pointer',
                fontSize: "1.6rem",
                position: 'relative'
            }}>
            <FiShoppingCart></FiShoppingCart>
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                transform: "translateX(50%)",
                fontSize: '10px'
            }}>
                <Badge>{totalAmount}</Badge>
            </div>
        </div>

        <CartSidebar show={state.showOffCanvas} onHide={toggleOffCanvas} placement='end'></CartSidebar>

        <Dropdown as={ButtonGroup} size='sm'>
            <Dropdown.Toggle split variant="link" id="dropdown-split-basic" size="sm" style={{ padding: 0 }}>
                <Link to="/profile">
                    <Image
                        roundedCircle
                        src={data.avatar || defaultImage}
                        width={"50px"} height={"50px"}
                        style={{
                            marginRight: '12px'
                        }}>
                    </Image>
                </Link>
                {/* <Navbar.Text>Hello, {data.username.substring(0,5)}...</Navbar.Text> */}
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul">
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="/account/profile">
                        Profile
                    </CustomLink>
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="/account/dashboard">
                        My work
                    </CustomLink>
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="/chat">
                        Message
                    </CustomLink>
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="/notify">
                        Notification
                    </CustomLink>
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="/sale">My Selling Channel</CustomLink>
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item as="li" className="align-middle" onClick={() => logout()}>
                    Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </>
}


const CartSidebar = (props: OffcanvasProps) =>{
    const {removeItemFromCart, clearCart, modifyItemCart, checkCartItem} = useActions();
    const {data: {itemList,totalPrice}} = useTypedSelector(s => s.cart);
    const {data: {addressList}} = useTypedSelector(s => s.user);
    return <>
        <Offcanvas {...props}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart Review</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div style={{
                    paddingBottom: '12px'
                }}>
                    {itemList.map((cartItem, index) => {
                        return <div key={index + 1}>
                            <Row>
                                <Col sm="1">
                                    <input 
                                        type={"checkbox"} 
                                        style={{cursor: 'pointer'}} 
                                        defaultChecked={cartItem.checked}
                                        onChange={() => checkCartItem(index)}></input>
                                </Col>
                                <Col>
                                    <span style={{
                                        display: 'inline-block',
                                        width: "80px",
                                        height: "80px",
                                        background: `url(${cartItem.image}) 0 0 / contain`
                                    }}>
                                    </span>
                                    <h4>{cartItem.item.name}</h4>
                                    <i>
                                        Price: {cartItem.item.price}
                                        <Input.NumberInput 
                                            readOnly
                                            value={cartItem.quantity} 
                                            min={1} 
                                            max={12000} 
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                                if(e.target.valueAsNumber){
                                                    modifyItemCart(index, cartItem.productId, e.target.valueAsNumber, cartItem.addressId);
                                                }
                                            }}
                                            ></Input.NumberInput>
                                    </i>
                                    <p>Address: {addressList.find(add => add.id === cartItem.addressId)?.receiverName}...</p>
                                    <p>Quantity: {cartItem.quantity}</p>
                                    <p>Total: ${cartItem.total}</p>
                                </Col>
                                <Col sm="1">
                                    <i style={{cursor:'pointer'}} onClick={() => removeItemFromCart(index)}>x</i>
                                </Col>
                            </Row>
                        </div>
                    })}
                </div>
            </Offcanvas.Body>
            <div>
                <Row xs={2} sm={2} style={{
                        position: 'sticky',
                        bottom: 0,
                        background: '#fff',
                        overflow: 'auto',
                        // padding: '1rem'
                    }}>
                        <Col sm="6">
                            <div>
                                {`Total: ${totalPrice} VND`}
                            </div>
                            <div>
                            <CustomLink to={{
                                pathname: '/cart'
                            }}>
                                <Button variant="success">Cart</Button>
                            </CustomLink>
                            </div>
                        </Col>
                        
                        <Col sm="6">
                            <CustomLink to={{
                                pathname: '/checkout'
                            }}>
                                <Button variant="success">Checkout</Button>
                            </CustomLink>
                            <Button variant="danger" onClick={clearCart}>Clear all</Button>
                        </Col>
                </Row>
            </div>
        </Offcanvas>
    </>
}



export { Navigation };