import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { CustomLink } from '../../components';
import { useTypedSelector } from '../../hooks'
import { timeDifferenceString } from '../../utils';

export const Notification = () => {
    const {data: {notifies}} = useTypedSelector(p => p.user);
    return (
        <Container style={{minHeight: '80vh', background: '#fff'}}>
            <article>
                <h3 style={{textTransform: 'uppercase'}}>Notification</h3>
            </article>

            <article>
                {notifies.filter(p => p).map((notify,index) =>{
                    return <div key={index}>
                            <Row className="ad-nav__submenu--item p-2" data-pointer xs={2} sm={2}>
                                <Col>
                                    <div className="ad-nav__submenu--line">
                                        <CustomLink to={notify.notification.url}>
                                            <span className="ad-nav__submenu--title">{notify.notification.userName}</span>
                                            {" "}
                                            <i className="ad-nav__submenu--message" title={notify.notification.shortMessage}>{notify.notification.shortMessage}</i>
                                        </CustomLink>
                                    </div>
                                    <div>
                                        <p>{timeDifferenceString(notify.notification.createdAt, new Date())}</p>
                                    </div>
                                </Col>
                            </Row>
                    </div>
                })}
            </article>
        </Container>
    )
}
