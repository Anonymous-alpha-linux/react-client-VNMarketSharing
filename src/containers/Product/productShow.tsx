import React from 'react'
import {Card,CardGroup, Button} from 'react-bootstrap';
import { CustomLink } from '../../components';
interface IProductItem{
    id:number;
    name: string;
    price: number;
    inventory: number;
    inPage?: boolean;
    description: string;
    soldQuantity?: number;
    mainUrl: string;
    urls?: string[];
    userPage?: IUser;
}

interface IUser{
    userPageId: number;
    avatarUrl: string;
    pageName: string;
}

export const ProductShow: React.FC<{}> = () => {
    return (
        <div>
        </div>
    )
}

export const ProductList: React.FC<{productList: IProductItem[]}> = ({productList}) =>{
    return <CardGroup>
        {productList.map(productItem => <SingleProduct key={productItem.id} productItem={productItem}></SingleProduct>)}
    </CardGroup>
}

export const SingleProduct: React.FC<{productItem: IProductItem}> = ({productItem}) => {
    return (
        <Card style={{ width: '18rem' }}>
            <CustomLink to={`product/${productItem.id}`}>
                <Card.Img variant="top" src={productItem.mainUrl} />
                <Card.Body>
                    <Card.Title>{productItem.name}</Card.Title>
                    <Card.Text>
                        {productItem.description}
                    </Card.Text>
                    <Button variant="primary">Add to Cart</Button>
                    <Button variant="success">Purchase</Button>
                </Card.Body>
            </CustomLink>
        </Card>
    )
}

