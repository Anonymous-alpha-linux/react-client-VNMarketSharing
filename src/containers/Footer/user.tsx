import React from 'react'
import { Col, Container, Image, Row, Stack } from 'react-bootstrap'
import { useTypedSelector } from '../../hooks'

export const User: React.FC<{}> = () => {
    const {data: {categoryList}} = useTypedSelector(s => s.category);
    return (<>
        <div className="py-5"
            style={{background:"#000", color:'#fff', borderBottom: '1px solid #fff'}}>
            <Container>
                <Row>
                    <Col>
                        <h4 style={{textTransform: 'uppercase', fontWeight: '700'}}>Shop</h4>
                        <Stack className="pt-3" style={{color:"#fff"}}>
                            {categoryList.filter(c => c.level === 0).map((c,index) =>{
                                return <span key={index + 1} style={{cursor:"pointer"}}>
                                    <p style={{color:"inherit"}}>{c.name}</p>
                                </span>
                            })}
                        </Stack>
                    </Col>
                    <Col>   
                        <h4 style={{textTransform: 'uppercase', fontWeight: '700'}}>Information</h4>
                        <Stack className="pt-3" style={{color:"#fff"}}>
                            {categoryList.filter(c => c.level === 0).map((c,index) =>{
                                return <span style={{cursor:"pointer"}} key={index + 1}>
                                    <p style={{color:"inherit"}}>{c.name}</p>
                                </span>
                            })}
                        </Stack>
                    </Col>
                    <Col>
                        <h4 style={{textTransform: 'uppercase', fontWeight: '700'}}>Customer Service</h4>
                        <Stack className="pt-3" style={{color:"#fff"}}>
                            {categoryList.filter(c => c.level === 0).map((c,index) =>{
                                return <span key={index + 1} style={{cursor:"pointer"}}>
                                    <p style={{color:"inherit"}}>{c.name}</p>
                                </span>
                            })}
                        </Stack>
                    </Col>
                    <Col>
                        <h4 style={{textTransform: 'uppercase', fontWeight: '700'}}>Become our collaborator</h4>
                        <Stack className="pt-3" style={{color:"#fff"}}>
                            {categoryList.filter(c => c.level === 0).map((c, index) =>{
                                return <span key={index} style={{cursor:"pointer"}}>
                                    <p style={{color:"inherit"}}>{c.name}</p>
                                </span>
                            })}
                        </Stack>
                    </Col>
                </Row>
            </Container>
        </div>
        <div style={{background: "#000", color:"#fff"}} >
            <Container>
                <Row style={{alignItems:'center'}}>
                    <Col md="8">
                        <p style={{color:"inherit",padding:"12px"}}>
                            {"© 2022 Beautica All Rights Reserved."} <br/>
                            {"Ecommerce Software by VNMarketSharing."} <br/>
                            {"Production by https://react-vnmarketsharing.netlify.app"}
                        </p>
                    </Col>
                    <Col>
                        <Image src="https://vnpay.vn/_nuxt/img/logo-primary.55e9c8c.svg" width={'120px'} height="60px" style={{float:'right', padding:'12px'}}></Image>
                    </Col>
                </Row>
            </Container>
        </div>
    </>)
}