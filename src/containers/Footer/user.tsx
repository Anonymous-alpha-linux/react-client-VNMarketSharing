import React from 'react'
import { Col, Image, Row, Stack } from 'react-bootstrap'
import { useTypedSelector } from '../../hooks'

export const User: React.FC<{}> = () => {
    const {data: {categoryList}} = useTypedSelector(s => s.category);
    return (<>
        <div style={{background:"#000", padding: '0 12rem', color:'#fff', borderBottom: '1px solid #fff'}} className="py-5">
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
                        {categoryList.filter(c => c.level === 0).map(c =>{
                            return <span style={{cursor:"pointer"}}>
                                <p style={{color:"inherit"}}>{c.name}</p>
                            </span>
                        })}
                    </Stack>
                </Col>
                <Col>
                    <h4 style={{textTransform: 'uppercase', fontWeight: '700'}}>Customer Service</h4>
                    <Stack className="pt-3" style={{color:"#fff"}}>
                        {categoryList.filter(c => c.level === 0).map(c =>{
                            return <span style={{cursor:"pointer"}}>
                                <p style={{color:"inherit"}}>{c.name}</p>
                            </span>
                        })}
                    </Stack>
                </Col>
                <Col>
                    <h4 style={{textTransform: 'uppercase', fontWeight: '700'}}>Become our collaborator</h4>
                    <Stack className="pt-3" style={{color:"#fff"}}>
                        {categoryList.filter(c => c.level === 0).map(c =>{
                            return <span style={{cursor:"pointer"}}>
                                <p style={{color:"inherit"}}>{c.name}</p>
                            </span>
                        })}
                    </Stack>
                </Col>
            </Row>
        </div>
        <div style={{background: "#000", color:"#fff", padding: '0 12rem'}} >
            <Row style={{alignItems:'center'}}>
                <Col>
                    <p style={{color:"inherit",padding:"12px"}}>
                        {"© 2022 Beautica All Rights Reserved. Ecommerce Software by BigCommerce. BigCommerce Themes & Templates by ThemeVale.com"}
                    </p>
                </Col>
                <Col>
                    <Image src="https://vnpay.vn/_nuxt/img/logo-primary.55e9c8c.svg" width={'120px'} height="60px" style={{float:'right', padding:'12px'}}></Image>
                </Col>
            </Row>
        </div>
    </>)
}