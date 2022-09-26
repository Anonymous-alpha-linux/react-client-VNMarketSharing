import React from 'react';
import { Dropdown, Navbar,ButtonGroup, Image } from 'react-bootstrap';
import { AiOutlinePrinter,
    AiOutlineDashboard, 
    AiOutlineInbox,
    AiOutlineShoppingCart,
    AiOutlineMail,
    AiOutlineBell } from 'react-icons/ai';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { BsDot } from 'react-icons/bs';
import { GoChevronRight,GoChevronDown } from 'react-icons/go';
import { SidebarPropData, Sidebar, Logo, CustomLink } from '../../components';
import { useActions, useTypedSelector } from '../../hooks';



interface SellerSidebarProps{
    children?: React.ReactNode;
}
const SellerSidebar = ({children}: SellerSidebarProps) => {
    const sidebarStatic : SidebarPropData[] = [
    {
        title: "Dashboard",
        path: "",
        icon: <AiOutlineDashboard></AiOutlineDashboard>,
        iconClosed: <p>ClosedIcon</p>,
        iconOpened: <p>OpenedIcon</p>,
        isRoot: true
    },
    {
        title: "Product",
        path: "product",
        icon: <AiOutlineInbox></AiOutlineInbox>,
        isOpened: false,
        iconClosed: <GoChevronRight></GoChevronRight>,
        iconOpened: <GoChevronDown></GoChevronDown>,
        isRoot: true,
        subNav: [
            {
                title: 'Product List',
                path: "product",
                icon: <BsDot></BsDot>,
                iconClosed: <p>ClosedIcon</p>,
                iconOpened: <p>OpenedIcon</p>,
            },
            {
                title: 'Add Product',
                path: "product/new",
                icon: <BsDot></BsDot>,
                iconClosed: <p>ClosedIcon</p>,
                iconOpened: <p>OpenedIcon</p>,
            }
        ]
    },
    {
        title: "Purchase",
        path: "purchase",
        icon: <AiOutlineShoppingCart></AiOutlineShoppingCart>,
        iconClosed: <GoChevronRight></GoChevronRight>,
        iconOpened: <GoChevronDown></GoChevronDown>,
        isRoot: true,
        isOpened: false,
        subNav: [
            {
                title: 'Order',
                path: "",
                icon: <BsDot></BsDot>,
                iconClosed: <p>ClosedIcon</p>,
                iconOpened: <p>OpenedIcon</p>,
            },
        ]
    },
    {
        title: "Expense",
        path: "expense",
        icon: <BiPurchaseTagAlt></BiPurchaseTagAlt>,
        iconClosed: <p>ClosedIcon</p>,
        iconOpened: <p>OpenedIcon</p>,
        isRoot: true
    },
    {
        title: "Report",
        path: "report",
        icon: <AiOutlinePrinter></AiOutlinePrinter>,
        iconClosed: <p>ClosedIcon</p>,
        iconOpened: <p>OpenedIcon</p>,
        isRoot: true
    },
    ]
    
    const {data: {userId}} = useTypedSelector(state => state.user);
    const {getSellerInfo}  = useActions();

    React.useEffect(() =>{
        if(userId){
            console.log(userId);
            getSellerInfo(parseInt(userId));
        }
    }, [userId]);

    return <>
        <Sidebar data={sidebarStatic} show={true}>
            {children}
        </Sidebar>
    </>
}

const SellerNavbar = () => {
    const {data} = useTypedSelector(state => state.auth);

    return <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#fff",
        padding: '0 2.4rem',
        position: 'sticky',
        top: 0,
        left: 0,
        height: '4rem',
        zIndex: 1000
    }}>
        <div className='ad-nav__logo'>
            <Logo></Logo>
        </div>

        <div className='ad-nav__tools' style={{
            display: 'inline-flex',
            gap: '1.2rem',
            fontSize: '1.4rem',
            fontWeight: '700'
        }}>
            <span>
                <AiOutlineBell></AiOutlineBell>
            </span>

            <span>
                <AiOutlineMail></AiOutlineMail>
            </span>

            <span>
                <ProfileTrigger user={data.email}></ProfileTrigger>
            </span>
        </div>
    </div>
}

const ProfileTrigger : React.JSXElementConstructor<{user: string}>= ({user}) =>{
    const {logout,getUserInfo} = useActions();
    const {data: {email}} = useTypedSelector(state => state.auth);
    const {data: {avatar}} = useTypedSelector(state => state.user);
    const {data: {pageAvatar}} = useTypedSelector(state => state.seller);

    const defaultImage = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

    React.useEffect(()=>{
        getUserInfo();
    },[email]);
    
    return <>
        <Dropdown as={ButtonGroup} size='sm'>
            <Dropdown.Toggle split variant="link" id="dropdown-split-basic" size="sm" style={{padding: 0}}>
                <CustomLink to="page">
                    <Image
                    roundedCircle 
                    src={pageAvatar || avatar || defaultImage}
                    width={"30px"} height={"30px"}>
                    </Image>
                </CustomLink>
            </Dropdown.Toggle>

            <Dropdown.Menu as="ul">
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="page">
                        Profile
                    </CustomLink>                   
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="">
                        My Dashboard
                    </CustomLink>                   
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="chat">
                        Message
                    </CustomLink>
                </Dropdown.Item>
                <Dropdown.Item as="li" className="align-middle">
                    <CustomLink to="notify">
                        Notification
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
        </Dropdown>

    </>
}

export {SellerSidebar, SellerNavbar}