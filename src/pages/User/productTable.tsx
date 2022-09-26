import React from 'react';
import {  AiOutlinePlus } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import { CustomLink } from '../../components';
import { Product } from '../../containers';
import { productAPIInstance } from '../../config';
import { axiosErrorHandler } from '../../hooks';
import { GetProductClassifyDetailResponseDTO, GetProductClassifyTypesResponseDTO, GetProductResponseDTO } from '../../models';
import axios from 'axios';

type ProductTablePageState = {
  data: any[];
  loading: boolean;
  take: number;
  page: number;
}
export function ProductTablePage() {
  const [state, setState] = React.useState<ProductTablePageState>({
    data: [],
    loading: false,
    take: 5,
    page: 1
  });
  const abortController = axios.CancelToken.source();

  React.useEffect(() => {
    loadData({
      page: state.page,
      take: state.take
    });
    return () => {
      abortController.cancel();
    }
  },[]);

  async function loadData(params: {
    page: number;
    take: number;
  }){      
    axiosErrorHandler(
      () =>{ 
        
        // Set pending state
        setState(o =>({
          ...o,
          loading: true
        }))

        // Fetching data from api
        productAPIInstance.getMyProductList({
              take: params.take,
              page: params.page
        }, {
          cancelToken: abortController.token
        })
        // onCompleted
        .then(({
          data
        }) =>{
          const dataResponse = data as GetProductResponseDTO[];
          const results: any[] = dataResponse.map(product => {
            const { id, 
              urls,
              soldQuantity,
              description,
              userPageId,
              userPageName,
              userPageAvatar,
              productCategories,
              productClassifies,
              productDetails,
              ...rest } = product;

            return {
              ...rest,
              price: productDetails.length ? `${Math.min(...productDetails.map(d => d.price))} - ${Math.max(...productDetails.map(d => d.price))}`: rest.price,
              name: {
                title: rest.name,
                image: urls[0] || ""
              },
              "product catalog": productClassifies.map(classify=>{
                return classify.name;
              }),
              "product classifies": productDetails.map(detail => {
                return {
                  title: [detail.productClassifyKey, detail.productClassifyValue].join(", "),
                  subtitle: `price: ${detail.price},\nremain: ${detail.inventory}`
                }
              }),
              "sold quantity": soldQuantity,
              categories: productCategories.map(c=>c.name)
            }
          });

          setState(o => {
            if(results.length >= o.take){
              loadData({
                page: o.page + 1,
                take: o.take
              }); 
            }

            return {
              ...o,
              data: [...o.data,...results],
              loading: false,
              page: results.length < o.take ? o.page : o.page + 1
            }
          });
        });
      },
      // onFetching Error
      _ =>{
        setState(o =>({
          ...o,
          loading: false
        }))
      }
    );  
  }

  return (<section className="" style={{
    padding: '0 1.5rem'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 0'
    }}>
      <span>
        <h2>Product List</h2>
        <i>Manage your products</i>
      </span>
      <span>
        <CustomLink to={"new"}>
          <Button style={{
            backgroundColor: 'var(--clr-logo)',
            fontWeight: '600',
            border: 'none',
            padding: '0.6em 0.8em'
          }}>
            <span style={{
              marginRight: '1.2em',
              verticalAlign: "text-top"
            }}>
              <AiOutlinePlus></AiOutlinePlus>
            </span> 
            <span>
              Add New Product
            </span>
          </Button>
        </CustomLink>
      </span>
    </div>
    <Product.ProductTable 
      data={state.data}
      headers={["name", "product classifies","price", "inventory", "inPages", "Sold quantity", "categories"]}
    ></Product.ProductTable>
  </section>
  )
}
