import React from 'react'
import {Card,Row,Col,Button,Stack,Container} from 'react-bootstrap';
import { BsCartPlusFill } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { CustomLink, CustomNavLink, Rating } from '../../components';
import { useActions } from '../../hooks';
import { GetProductResponseDTO } from '../../models';
import "./index.css";
const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

interface IUser{
    userPageId: number;
    avatarUrl: string;
    pageName: string;
}

export const ProductList: React.FC<{productList: GetProductResponseDTO[]}> = ({productList}) =>{
    return <Container fluid>
        <Row xs={1} sm={2} md={3} lg={4} style={{margin: '0 auto', display: 'inline-flex', justifyContent: 'flex-start'}}>
            {productList.map(productItem => <Col key={productItem.id} xs={12} sm={6} md={4} lg={3}>
                <SingleProduct productItem={productItem}></SingleProduct>
            </Col>
            )}
        </Row>
    </Container>
}


export const SingleProduct: React.FC<{productItem: GetProductResponseDTO, view?: "grid" | "stack"}> = ({productItem, view = "grid"}) => {
    const {addToCart} = useActions();
    const isMobileScreen = useMediaQuery({
        query: '(max-width: 575px)'
    });
    const isSmallScreen = useMediaQuery({
        query: '(min-width: 576px)'
    });
    const isMediumScreen = useMediaQuery({
        query: '(min-width: 768px)'
    });
    const isLargeScreen = useMediaQuery({
        query: '(min-width:992px)'
    });
    const isExLargeScreen = useMediaQuery({
        query: '(min-width:1200px)'
    });

    if(view === "grid"){
        return (
            <>
                <Card className="singleProduct__card" style={{ 
                    maxWidth: isMobileScreen ? '320px': isExLargeScreen ? '440px': isLargeScreen ? '420px' : isMediumScreen ? "100%" : "auto",
                    minWidth: isMobileScreen ? '320px': '320px',
                    width: '100%'
                }}>
                    <CustomLink to={`/product/${productItem.id}`}>                       
                        <Card.Body>
                            <div className="singleProduct__top">
                                <div className='singleProduct__image' style={{
                                    background: `url(${productItem.urls[0]}) center / 100% no-repeat,
                                                url(${defaultAvatar}) center / 100% no-repeat`,
                                    width: `${isMobileScreen ? "100%" : "100%"}`,
                                    height: `${isMobileScreen ? "200px" : "320px"}`,
                                }}>
                                    <CustomLink to={`/product/${productItem.id}`}>
                                        <div className="singleProduct__image--cursor">
                                            View
                                        </div>
                                    </CustomLink>
                                    <div className="singleProduct__label--list">
                                        <label data-label-product-type={"new"}>NEW</label>
                                        <label data-label-product-type={"sale"}>SALE</label>
                                        <label data-label-product-type={"sold"}>SOLD OUT</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{
                                height: '3rem',
                                margin: "12px 0"
                            }}>
                                <Card.Title className="single-product__name"
                                    title={productItem.name}>
                                    {productItem.name}
                                </Card.Title>
                            </div>

                            <div style={{
                                height: '4rem',
                                margin: "12px 0"
                            }}>
                                <Card.Text className="single-product__description" >
                                    {productItem.description}
                                </Card.Text>
                            </div>
    
                            
                            <Card.Subtitle style={{textAlign: 'center', marginTop: '1.8rem', color: "red"}}>
                                <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>{productItem.price.toFixed(2)}</i>    
                                {productItem.price.toFixed(2)} VND
                            </Card.Subtitle>
    
                            <div style={{textAlign: 'center'}}>
                                <Rating.Star></Rating.Star>
                            </div>
                        </Card.Body>
                    </CustomLink>
                    <Card.Footer>
                        <Row gap={1} style={{justifyContent: 'space-between'}}>
                            <Col sm={'auto'}>
                                <Button variant="primary" onClick={() => addToCart(productItem)} style={{cursor: 'pointer'}}>
                                    <BsCartPlusFill></BsCartPlusFill>
                                </Button>
                            </Col>
                            <Col sm={'auto'}>
                                <Button variant="warning" style={{cursor: 'pointer'}}>Purchase</Button>
                                {" "}
                                <Button variant="danger" style={{cursor: 'pointer'}} >
                                    <FaHeart></FaHeart>
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                    <span className='singleProduct__tag'>
                        Check the detail
                    </span>
                </Card>
            </>
        )
    }

    return <>
        <div className="singleProductStack__card">
            <Row xs={1} md={1}>
                <Col md={3}>
                    <div className='singleProduct__image' style={{
                        background: `url(${productItem.urls[0]}) center / 100% no-repeat,
                                    url(${defaultAvatar}) center / 100% no-repeat`
                    }}>
                        <CustomLink to={`/product/${productItem.id}`}>
                            <div className="singleProduct__image--cursor">
                                View
                            </div>
                        </CustomLink>
                    </div>
                </Col>
                <Col md={9} style={{padding:'2rem 1rem 1rem 1rem'}}>
                    <Stack direction="vertical">
                        <div style={{
                            height: '3rem',
                            margin: "12px 0"
                        }}>
                            <h3 className="single-product__name"
                            style={{cursor:'pointer'}}
                                title={productItem.name}>
                                <CustomNavLink to={`/product/${productItem.id}`}>
                                    {productItem.name}
                                </CustomNavLink>
                            </h3>
                        </div>
                        <h4 style={{ marginTop: '1.8rem', color: "red"}}>
                            <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>{productItem.price.toFixed(2)}</i>    
                            {productItem.price.toFixed(2)} VND
                        </h4>
                        <i className='singleProduct__description--stack'>{productItem.description}</i>
                        <div style={{margin:'1.8rem 0'}}>
                            <Rating.Star></Rating.Star>
                        </div>
                        <div>
                            <Button style={{background:'var(--clr-logo)', border:'none'}} onClick={() => addToCart(productItem)}>
                                <BsCartPlusFill></BsCartPlusFill>
                                <b style={{verticalAlign: 'middle', marginLeft: '1rem', fontSize:"1rem"}}>ADD TO CART</b>
                            </Button>
                            <Button style={{background:"transparent", outline:'none', border: 'none', color:'red', fontSize:'1.2rem', marginLeft: '2.5rem'}}>
                                <FaHeart></FaHeart>
                                <b style={{verticalAlign: 'middle', marginLeft: '1rem', fontSize:"1rem"}}>ADD TO WISHLIST</b>
                            </Button>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </div>
    </>
}

