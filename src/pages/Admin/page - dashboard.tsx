import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { BiPurchaseTagAlt, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { FiUser, FiUserCheck } from 'react-icons/fi';
import { HiShoppingBag } from 'react-icons/hi'
import { MdOutlinePayments } from 'react-icons/md';
import { TbReportMoney } from 'react-icons/tb';
import "./index.css";
import { ProductTableAdapter } from './adapter - productTable';
import { GetRecentProductResponseDTO, SellerPageResponseDTO } from '../../models';
import { dashboardAPIInstance } from '../../config';
import { useResponsive } from '../../hooks';

const showedContents: DashboardEntry[] = [
    {
        title: '$400000',
        label: 'Total Purchase Due',
        icon: <HiShoppingBag></HiShoppingBag>
    },
    {
        title: '$400000',
        label: 'Total Sales Due',
        icon: <MdOutlinePayments></MdOutlinePayments>
    },
    {
        title: '$400000',
        label: 'Total Sale Amount',
        icon: <BiTrendingUp></BiTrendingUp>
    },
    {
        title: '$400000',
        label: 'Total Expense Amount',
        icon: <BiTrendingDown></BiTrendingDown>
    }
]

const showedSecondContents: DashboardEntry[] = [
    {
        title: '100',
        label: 'Customers',
        icon: <FiUser></FiUser>,
        labelClassName: 'dashboard-entry__label'
    },
    {
        title: '100',
        label: 'Suppliers',
        icon: <FiUserCheck></FiUserCheck>,
        labelClassName: 'dashboard-entry__label'
    },
    {
        title: '100',
        label: 'Purchase Invoice',
        icon: <BiPurchaseTagAlt></BiPurchaseTagAlt>,
        labelClassName: 'dashboard-entry__label'
    },
    {
        title: '105',
        label: 'Sales Invoice',
        icon: <TbReportMoney></TbReportMoney>,
        labelClassName: 'dashboard-entry__label'
    }
]

export function DashboardPage() {

    const functions = {
        renderDashboardEntry(dashboardEntry: DashboardEntry, options?: {
            rowClassName: string
        }){
            return (
                <div className={"pt-3 mb-2 dashboard-entry__board " + options?.rowClassName}>
                    <Container>
                        <Row xs={2} sm={2}>
                            <Col className={dashboardEntry?.iconClassName || "dashboard-entry__icon"} xs={3} sm={3} lg={2} xl={2}>
                                {dashboardEntry.icon}
                            </Col>
                            <Col xs={'auto'} sm={'auto'}>
                                <h4 className={dashboardEntry?.titleClassName}>{dashboardEntry.title}</h4>
                                <p className={dashboardEntry?.labelClassName}>{dashboardEntry.label}</p>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        },
        renderRecentUsers(){
            return (
                <RecentSellerList></RecentSellerList>
            )
        },
        renderRecentProduct(){
            return (
            <RecentProductList></RecentProductList>)
        }
    }

    return (
        <section className="p-3">
            <Row className="my-2" xs={1} sm={1} md={2} lg={2} xl={3} xxl={4}>
                {showedContents.map((item, index) =>{
                    return <Col key={index}>
                        {functions.renderDashboardEntry(item)}
                    </Col>
                })}
            </Row>
            <Row className="my-2" xs={1} sm={1} md={2} lg={3} xl={3} xxl={4}>
                {showedSecondContents.map((item, index) =>{
                    return <Col key={index}>
                        {functions.renderDashboardEntry(item, {
                            rowClassName: 'dashboard-entry__solid'
                        })}
                    </Col>
                })}
            </Row>
            <Row xs={1} sm={1} md={1} lg={2} className="my-2">
                <Col>
                    <section className='p-4'>
                        <article>
                            <h3>Chart</h3>
                            <i>Chart</i>
                        </article>
                    </section>
                </Col>
                <Col>
                    {functions.renderRecentUsers()}
                </Col>
            </Row>
            <Row className="my-2">
                {functions.renderRecentProduct()}
            </Row>
        </section>
    )
}

export function RecentSellerList(){
    const [state, setState] = React.useState<RecentSellerListState>({
        data: [],
        loading: false
    });

    const functions = {
        fetchRecentSellerList() {
            const data = [
            {
                id: 0,
                name: "An nguyen",
                bannerUrl: 'a',
                biography: 'Shop of ecommerce',
                description: 'a',
                email: 'abc@gmail.com',
                pageAvatar: 'http://bigdata-vn.com/wp-content/uploads/2021/10/Background-book-%E2%80%93-Background-sach-dep-an-tuong-va-sang.jpg',
                phone: '0333.377.722',
                productName: 'Soft chair'
            },
            {
                id: 1,
                name: "Binh nguyen",
                bannerUrl: 'a',
                biography: 'Shop of ecommerce',
                description: 'a',
                email: 'abc@gmail.com',
                pageAvatar: 'http://bigdata-vn.com/wp-content/uploads/2021/10/Background-book-%E2%80%93-Background-sach-dep-an-tuong-va-sang.jpg',
                phone: '0333.377.722',
                productName: 'Soft chair'
            },
            {
                id: 2,
                name: "An nguyen",
                bannerUrl: 'a',
                biography: 'Shop of ecommerce',
                description: 'a',
                email: 'abc@gmail.com',
                pageAvatar: 'http://bigdata-vn.com/wp-content/uploads/2021/10/Background-book-%E2%80%93-Background-sach-dep-an-tuong-va-sang.jpg',
                phone: '0333.377.722',
                productName: 'Soft chair'
            },
            {
                id: 3,
                name: "Binh nguyen",
                bannerUrl: 'a',
                biography: 'Shop of ecommerce',
                description: 'a',
                email: 'abc@gmail.com',
                pageAvatar: 'http://bigdata-vn.com/wp-content/uploads/2021/10/Background-book-%E2%80%93-Background-sach-dep-an-tuong-va-sang.jpg',
                phone: '0333.377.722',
                productName: 'Soft chair'
            },
            {
                id: 4,
                name: "Binh nguyen",
                bannerUrl: 'a',
                biography: 'Shop of ecommerce',
                description: 'a',
                email: 'abc@gmail.com',
                pageAvatar: 'http://bigdata-vn.com/wp-content/uploads/2021/10/Background-book-%E2%80%93-Background-sach-dep-an-tuong-va-sang.jpg',
                phone: '0333.377.722',
                productName: 'Soft chair'
            },
            ];
            setState(o =>({...o, data}));
        }
    }

    React.useEffect(() =>{
        functions.fetchRecentSellerList();
    },[]);

    return (
        <div className="recent-user-list px-3 py-3">
            <article>
                <h4 className='recent-user-list__heading'>Recently Sellers</h4>
            </article>
            <div>
                <table className='recent-user-list__table'>
                    <thead className='recent-user-list__head-table'>
                        <th className='p-2'>No</th>
                        <th className='p-2'>
                            Seller Name
                        </th>
                        <th className='p-2'>Shop</th>
                        <th className='p-2'>Best Product</th>
                    </thead>
                    <tbody className='recent-user-list__body-table'>
                        {state.data.map(item =>{
                            return (
                                <tr>
                                    <td className='px-2 py-3'>{item.id}</td>
                                    <td className='p-2'>
                                        <Row>
                                        <Col xs="auto" sm="auto">
                                            <Image 
                                                src={item.pageAvatar}
                                                width="30px"></Image>
                                        </Col>
                                        <Col>
                                            {item.name}
                                        </Col>
                                    </Row>
                                    </td>
                                    <td className='p-2'>{item.biography}</td>
                                    <td className='p-2'>{item.productName}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function RecentProductList(){
    const [state,setState] = React.useState<RecentProductListState>({
        data: [],
        loading: false,
    });
    const functions = {
        load(loading: boolean){
            setState(o =>({
                ...o,
                loading: loading
            }));
        },
        fetchRecentProductList() {
            this.load(true);
            dashboardAPIInstance.getRecentProduct().then(response =>{
                if(Array.isArray(response.data)){
                    const data = response.data as GetRecentProductResponseDTO[];
                    setState(o => ({
                        ...o,
                        data: data,
                        loading: false
                    }));
                }
            }).catch(error =>{
                console.log(error);
            });
        }
    }
    React.useEffect(() =>{
        functions.fetchRecentProductList();
    },[]);

    return (<>
        <ProductTableAdapter 
            data={state.data.map(item =>{
                const avatar = "https://img.freepik.com/premium-vector/kawaii-hamburger-cute-fast-food-characterxdxafast-food-dish-pink-background-cute-food-vector-illustration-app-user-interface_527702-10.jpg?w=2000";
                return {
                    "Code Id": item.id,
                    "Product": {
                        title: item.productName,
                        image: item.productImage
                    },
                    "Seller": {
                        title: item.sellerName,
                        image: avatar
                    },
                    "Sold": item.orderAmount
                }
            })}
        ></ProductTableAdapter>
    </>)
}

type DashboardEntry = {
    title: string;
    label: string;
    icon: React.ReactNode;
    style?: React.CSSProperties;
    labelClassName?: string; 
    titleClassName?: string;
    iconClassName?: string;
}

type RecentSellerListState = {
    loading: boolean;
    data: (SellerPageResponseDTO & {
        productName: string
    })[];
}

type RecentProductListState = {
    loading: boolean;
    data: GetRecentProductResponseDTO[];
}