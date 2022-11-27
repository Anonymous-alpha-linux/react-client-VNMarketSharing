import React from 'react';
import { Dropdown,ButtonGroup, Image, Row, Col, Badge, Stack } from 'react-bootstrap';
import axios from 'axios';
import { 
    AiOutlineBell 
} from 'react-icons/ai';
import {BsThreeDotsVertical} from 'react-icons/bs';
import { useTypedSelector,useActions, useResponsive, screenType} from '../../hooks';
import { Logo, CustomLink, MenuBar } from '../../components';
import "./index.css";
import { timeDifferenceString } from '../../utils';

const AdminNavbar = () => {
    const [openedTriggeredOnMobile, setOpenTrigger] = React.useState(false);
    const screen = useResponsive()

    return (
        <>
            <Row className="navbar__admin">
                {screen <= screenType["mobile"] && <Col></Col>}
                <Col className='ad-nav__logo'>
                    <Logo></Logo>
                </Col>

                {screen <= screenType['mobile'] ? 
                    (<Col className="ad-nav__toggle" data-pointer onClick={() => setOpenTrigger(o => !o)}>
                        <BsThreeDotsVertical></BsThreeDotsVertical>
                    </Col>) :
                    (<Col className='ad-nav__tools' xs="auto" sm="auto" style={{
                        display: 'inline-flex',
                        gap: '1.2rem',
                        fontSize: '1.4rem',
                        fontWeight: '700'
                    }}>
                        <div style={{height: '100%', display: 'inline-block'}}>
                            <MenuBar menu={[
                                {
                                    trigger: (
                                            <AiOutlineBell></AiOutlineBell>
                                        ),
                                    subs: [
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                        {
                                            title: 'Nguyen Van A',
                                            message: 'Posted a new product',
                                            date: new Date(),
                                            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
                                        },
                                    ],
                                    additionalBottom: 20,                          
                                }
                            ]}
                            badge={<Badge bg="danger">23</Badge>}
                            clickedAction={true}
                            position={screen !== screenType['mobile'] ? 'right' : 'center'}
                            >
                                {({currentIndex, menu, displaySub}) =>(<>
                                    <section className='ad-nav__submenu' data-show={displaySub}>
                                        <article className='ad-nav__submenu--heading p-2'>
                                            <Row>
                                                <Col>
                                                    <h4 style={{margin: 0}}>Notifications</h4>
                                                </Col>
                                                <Col>
                                                    <p data-pointer style={{textAlign: 'right', margin: 0}}>Clear All</p>
                                                </Col>
                                            </Row>
                                        </article>
                                        <article className='ad-nav__submenu--body p-2'>
                                            {menu[currentIndex].subs.map((sub,index) =>{
                                                return (
                                                    <div key={index}>
                                                        <Row className="ad-nav__submenu--item p-2" data-pointer xs={2} sm={2}>
                                                            <Col xs={2} sm={2}>
                                                                <Image src={sub.avatar} style={{width: '40px'}} roundedCircle></Image>
                                                            </Col>
                                                            <Col xs={"auto"} sm="auto">
                                                                <div className="ad-nav__submenu--line">
                                                                    <span className="ad-nav__submenu--title">{sub.title}</span>
                                                                    {" "}
                                                                    <i className="ad-nav__submenu--message" title={sub.message}>{sub.message}</i>
                                                                </div>
                                                                <div>
                                                                    <p>{timeDifferenceString(sub.date, new Date())}</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )
                                            })}
                                        </article>
                                        <article className='ad-nav__submenu--footer p-2'>
                                            <CustomLink to="/admin/notify">
                                                <p>
                                                    Show all notifications
                                                </p>
                                            </CustomLink>
                                        </article>
                                    </section>
                                </>)}
                            </MenuBar>
                        </div>
                        <span>
                            <ProfileTrigger></ProfileTrigger>
                        </span>
                    </Col>)
                }
            </Row>
            {(screen <= screenType["mobile"]) && (
                <Row style={{
                    justifyContent: 'center', 
                    textAlign: 'center', 
                    maxHeight: openedTriggeredOnMobile ? 0 : "100vh",
                    transition: "max-height 1s",
                    overflow: 'hidden'
                }}>
                    <Col>
                        <ProfileTrigger></ProfileTrigger>
                    </Col>
                </Row>
            )}
        </>
    )
}

const ProfileTrigger = () => {
    const {logout,getUserInfo} = useActions();
    const {data: {email}} = useTypedSelector(state => state.auth);
    const {data: {avatar, username}} = useTypedSelector(state => state.user);
    const {data: {pageAvatar}} = useTypedSelector(state => state.seller);
    const screen = useResponsive();

    const [userAvatar, setUserAvatar] = React.useState("");

    const defaultImage = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';
    const functions = {
        tryLoadUserImage(imageUrls: (string | undefined)[], index: number){
            const nextLoadImage = imageUrls?.[index];
            if(!!nextLoadImage){
                axios.get(nextLoadImage, {
                    responseType:'blob'
                }).then(r =>{
                    console.log("success", nextLoadImage);
                    setUserAvatar(nextLoadImage);
                }).catch(error =>{
                    console.log(nextLoadImage, error);
                    if(index === imageUrls.length - 1){
                        setUserAvatar(defaultImage);
                        return;
                    }
                    
                    this.tryLoadUserImage(imageUrls, index + 1);
                });
            }
            else {
                setUserAvatar(defaultImage);
            }
        },
        renderProfileTriggerInMobile(){
            return screen <= screenType["mobile"] && (
                <Col>
                    <Stack>
                        <CustomLink to="/admin/notify">
                            Notify
                        </CustomLink>     
                        <CustomLink to="chat">
                            Message
                        </CustomLink>
                        <CustomLink to="/">
                            Back to Buy
                        </CustomLink>
                        <article className="align-middle" onClick={() => logout()}>
                            Logout
                        </article>
                    </Stack>
                </Col>
            )
        }
    }

    React.useEffect(() =>{
        functions.tryLoadUserImage([pageAvatar, avatar, defaultImage], 0);
    }, [pageAvatar, avatar]);

    React.useEffect(()=>{
        getUserInfo();
    },[email]);
    
    return <>
        <Row className="align-items-center pt-3 bg-white" 
            style={{
                flexDirection: screen <= screenType["mobile"] ? "column-reverse" : 'row'
            }}
        >
            {functions.renderProfileTriggerInMobile()}
            <Col>
                <p className="mb-1" style={{fontSize: "0.8rem", textAlign: screen <= screenType["mobile"] ? 'center' : 'right'}}>Hello, Admin</p>
                <h5 style={{margin: 0, whiteSpace: 'nowrap'}}>{username || email}</h5>
            </Col>
            <Col>
                <CustomLink to="/admin/dashboard">
                    <Image
                    roundedCircle 
                    src={userAvatar}
                    width={"30px"} height={"30px"}>
                    </Image>
                </CustomLink>
                {screen > screenType["mobile"] &&
                (<Dropdown as={ButtonGroup} size='sm'>
                    <Dropdown.Toggle className="ms-2" split variant="link" id="dropdown-split-basic" size="sm" style={{padding: 0}}>
                    </Dropdown.Toggle>

                    <Dropdown.Menu as="ul" className="mt-3">
                        <Dropdown.Item as="li" className="align-middle">
                            <CustomLink to="/admin/dashboard">
                                My Dashboard
                            </CustomLink>                   
                        </Dropdown.Item>
                        <Dropdown.Item as="li" className="align-middle">
                            <CustomLink to="chat">
                                Message
                            </CustomLink>
                        </Dropdown.Item>
                        <Dropdown.Item as="li" className="align-middle">
                            <CustomLink to="/">Back to Buy</CustomLink>
                        </Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item as="li" className="align-middle" onClick={() => logout()}>
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>)}
            </Col>
        </Row>
    </>
}


export {AdminNavbar};