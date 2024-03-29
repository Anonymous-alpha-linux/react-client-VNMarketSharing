import React from 'react'
import {Card,Row,Col,Button,Stack,Container, Form, RowProps, ColProps} from 'react-bootstrap';
import { BsCartPlusFill, BsCashCoin } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import { CustomLink, CustomNavLink, Rating } from '../../components';
import { useActions, useTypedSelector } from '../../hooks';
import { GetProductResponseDTO } from '../../models';
import "./index.css";
const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

interface IUser{
    userPageId: number;
    avatarUrl: string;
    pageName: string;
}

export const ProductList: React.FC<{
    productList: GetProductResponseDTO[], 
    rowProps?: RowProps,
    colProps?: ColProps    
}> = ({productList, rowProps, ...props}) =>{
    return <>
        <Row style={{margin: '0 auto'}} {...rowProps}>
            {productList.map(productItem => <Col key={productItem.id} {...props.colProps}>
                <SingleProduct productItem={productItem}></SingleProduct>
            </Col>
            )}
        </Row>
    </>
}


export const SingleProduct: React.FC<{productItem: GetProductResponseDTO, view?: "grid" | "stack"}> = ({productItem, view = "grid"}) => {
    const {data: {addressList}} = useTypedSelector(s => s.user);
    const {addToCart} = useActions();
    const [addressId, setAddressId] = React.useState(0);
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
    const price = productItem?.productDetails?.map?.(d => d.price) || productItem.price.toLocaleString("en-US", {
        maximumFractionDigits: 0,
    });

    React.useEffect(() =>{
        const addressId = addressList.find(a => a.addressType === 1 && a.isDefault)?.id;
        if(addressId){
            setAddressId(addressId);
        }
    },[addressList]);

    if(view === "grid"){
        return (
            <>
                <Card className="singleProduct__card" style={{ 
                    maxWidth: isMobileScreen ? '320px': isExLargeScreen ? '440px': isLargeScreen ? '100%' : isMediumScreen ? "100%" : "auto",
                    minWidth: isMobileScreen ? '320px': '100%',
                    width: '100%'
                }}>
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
                        
                        <CustomLink to={`/product/${productItem.id}`}>  
                            <div style={{
                                height: '3rem',
                                margin: "12px 0"
                            }}>
                                <Card.Title className="single-product__name"
                                    title={productItem.name}>
                                    {productItem.name}
                                </Card.Title>
                            </div>
                        </CustomLink>

                        <div style={{
                            height: '4rem',
                            margin: "12px 0"
                        }}>
                            <Card.Text className="single-product__description" >
                                {productItem.description}
                            </Card.Text>
                        </div>
                        
                        <Card.Subtitle style={{textAlign: 'center', marginTop: '1.8rem', color: "red"}}>
                            <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>
                                    {Array.isArray(price) 
                                    ? `${Math.min(...price).toLocaleString("en-US")} - ${Math.max(...price).toLocaleString("en-US")}`
                                    : price}
                            </i>    
                            {Array.isArray(price) && price.length
                                ? `${Math.min(...price).toLocaleString("en-US")} - ${Math.max(...price).toLocaleString("en-US")}`
                                : price} 
                        </Card.Subtitle>

                        <div style={{textAlign: 'center'}}>
                            <Rating.Star percentage={0.6}></Rating.Star>
                        </div>

                        <div>
                            <Form.Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddressId(parseInt(e.target.value))}>
                                {addressList.map((address,index) =>{
                                    return <option value={address.id} key={index + 1}>
                                        {`${address.receiverName} - ${address.streetAddress} - ${address.ward} - ${address.district} - ${address.city}`}
                                    </option>
                                })}
                            </Form.Select>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <Row gap={1} style={{justifyContent: 'space-between'}}>
                            <Col sm={'auto'}>
                                {
                                    !!productItem.productDetails.length ?
                                    <CustomLink to={{
                                        pathname: `/product/${productItem.id}`
                                    }}>
                                        <Button
                                            style={{
                                                background: "#f09a22",
                                                cursor: 'pointer', 
                                                textTransform: 'uppercase',
                                                fontWeight: '600',
                                                border: 'none'
                                            }}>
                                            Options
                                        </Button>
                                    </CustomLink>
                                    :
                                    <Button 
                                    onClick={() => {
                                        addToCart(productItem, addressId);
                                        toast.success("Added this item to cart", {
                                            position: 'bottom-left',
                                        });
                                    }} 
                                    style={{cursor: 'pointer', background: '#298f00', boxShadow: 'none', border: 'none', height: '100%'}}>
                                        <span data-text-align="middle">
                                            <BsCartPlusFill></BsCartPlusFill>
                                        </span>
                                    </Button>
                                }
                            </Col>
                            <Col sm={'auto'}>
                                <Button variant="warning" style={{cursor: 'pointer'}}>
                                    <BsCashCoin></BsCashCoin>
                                </Button>
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
                            <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>
                                {Array.isArray(price) 
                                ? `${Math.min(...price).toLocaleString("en-US")} - ${Math.max(...price).toLocaleString("en-US")}`
                                : price}
                            </i>    
                            {Array.isArray(price) 
                                ? `${Math.min(...price).toLocaleString("en-US")} - ${Math.max(...price).toLocaleString("en-US")}`
                                : price} 
                        </h4>
                        <i className='singleProduct__description--stack'>{productItem.description}</i>
                        <div className="my-4">
                            <Rating.Star percentage={0.6}></Rating.Star>
                            <span className="ms-2">{productItem.reviewAmount || "No review yet"}</span>
                        </div>
                        
                        <div>
                            <Form.Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddressId(parseInt(e.target.value))}>
                                <option>
                                    <CustomLink to={{
                                        pathname: "/account/address"
                                    }}></CustomLink>
                                </option>
                                {addressList.map((address,index) =>{
                                    return <option value={address.id} key={index + 1}>
                                        {`${address.receiverName} - ${address.streetAddress} - ${address.ward} - ${address.district} - ${address.city}`}
                                    </option>
                                })}
                            </Form.Select>
                        </div>

                        <div>
                            {
                                !!productItem.productDetails.length ?
                                    <CustomLink to={{
                                        pathname: `/product/${productItem.id}`
                                    }}>
                                        <Button className="bg-dark" 
                                            style={{
                                                cursor: 'pointer', 
                                                textTransform: 'uppercase'
                                            }}>
                                            Choose your options
                                        </Button>
                                    </CustomLink>
                                    :
                                    <Button style={{background:'var(--clr-logo)', border:'none'}} onClick={() => addToCart(productItem, addressId)}>
                                        <BsCartPlusFill></BsCartPlusFill>
                                        <b style={{verticalAlign: 'middle', marginLeft: '1rem', fontSize:"1rem"}}>ADD TO CART</b>
                                    </Button>
                            }
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

