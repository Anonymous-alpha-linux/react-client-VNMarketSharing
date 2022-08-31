import axios from 'axios';
import React from 'react'
import { productAPIInstance } from '../../config';
import { axiosErrorHandler } from '../../hooks';
import { PostProductRequest } from '../../models';
import { Product } from '../../containers';
const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export function ProductPage() {
    type ProductPageDataState = {
        id: number;
        name: string;
        price: number;
        inventory: number;
        description: string;
        soldQuantity: number;
        inPages?: boolean;
        userPageId?: number;
        category?: {id: number; name: string}[];
        mainUrl?: string;
    }
    interface IProductState {
        loading: boolean;
        error: string;
        data: ProductPageDataState[];
    }
    const [state ,setState] = React.useState<Partial<IProductState>>({
        loading: false,
        error: '',
        data: []
    });
    function setStateData(data: ProductPageDataState[]) {
        setState(o => ({
            loading: false,
            error: '',
            data: data
        }));
    }
    React.useEffect(() => {
        const cancelSource = axios.CancelToken.source();

        axiosErrorHandler(
            () => {
                setState(o =>({
                    ...o,
                    loading: true,
                    error: ''
                }));

                productAPIInstance.getProductList({
                    page: 1,
                    take: 5
                },{
                    cancelToken: cancelSource.token
                })
                .then(({data}) => {
                    if(data){
                        setStateData(data);
                    }
                });
            },
        );
        return () =>{
            cancelSource.cancel();
        }
    },[]);

    return (
        <div>
            {
                state.data && <Product.ProductList productList={state.data?.map(item =>({
                    id: item.id,
                    description: item.description,
                    inventory: item.inventory,
                    mainUrl: item?.mainUrl || defaultAvatar,
                    name: item.name,
                    price: item.price,
                    inPage: item.inPages,
                    soldQuantity: item.soldQuantity
                }))}></Product.ProductList>
            }
        </div>
    )
}