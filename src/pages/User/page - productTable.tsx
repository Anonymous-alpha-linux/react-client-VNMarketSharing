import React from 'react';
import {  AiOutlinePlus } from 'react-icons/ai';
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap';
import { CustomLink } from '../../components';
import { Product } from '../../containers';
import { productAPIInstance } from '../../config';
import { axiosErrorHandler } from '../../hooks';
import { GetProductResponseDTO } from '../../models';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type TableProductModel = {
  id:number;
  categories: string[];
  createdAt: string;
  hasAccepted: boolean;
  inPages: boolean;
  inventory: number;
  name: {
    image: string;
    title: string;
  };
  price: string | number;
  "product catalog": string[];
  "product classifies": {
    title: string;subtitle: string;
  }[];
  "product details": string | number;
  reviewAmount: number;
}

type ProductTablePageState = {
  data: TableProductModel[];
  loading: boolean;
  take: number;
  page: number;
  showModal: boolean;
  currentIndex: number;
  mode: "read" | "update" | "delete";
}

export function ProductTablePage() {
  const [state, setState] = React.useState<ProductTablePageState>({
    data: [],
    loading: false,
    take: 5,
    page: 1,
    showModal: false,
    currentIndex: 0,
    mode: "read"
  });
  const abortController = axios.CancelToken.source();
  const navigate = useNavigate();
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
          const results: TableProductModel[] = dataResponse.map(product => {
            const { id, 
              urls,
              soldQuantity,
              description,
              userPage,
              productCategories,
              productClassifies,
              productDetails,
              ...rest } = product;

            return {  
              ...rest,
              id,
              price: !!productDetails?.length ? `${Math.min(...productDetails.map(d => d.price))} - ${Math.max(...productDetails.map(d => d.price))}`: rest.price,
              name: {
                title: rest.name,
                image: urls[0] || ""
              },
              "product catalog": productClassifies.map(classify=>{
                return classify.name;
              }),
              "product classifies": productDetails?.map(detail => {
                return {
                  title: [detail.productClassifyKey, detail.productClassifyValue].join(", "),
                  subtitle: `price: ${detail.price},\nremain: ${detail.inventory}`
                }
              }),
              "product details": productClassifies?
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

  const functions = {
    componentDelete() {
      return (<>
        <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Do you want to delete this product {state.data?.[state.currentIndex]?.name?.title} ?</span>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col><Button onClick={() => this.handlerDelete()}>Yes</Button></Col>
            <Col><Button>Cancel</Button></Col>
          </Row>
        </Modal.Footer>
      </>)
    },
    componentUpdate() {
      return (<>
        <Modal.Header closeButton>
        <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Do you want to update this product {state.data?.[state.currentIndex]?.name?.title} ?</span>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col><Button onClick={() => {
              navigate("/product/update", {state: {
                fromProductTable: true,
                productId: state?.data?.[state.currentIndex]?.id,
              }});
            }}>Yes</Button></Col>
            <Col><Button>Cancel</Button></Col>
          </Row>
        </Modal.Footer>
      </>)
    },
    componentRead(){
      const data = state.data?.[state.currentIndex];
      return (<>
        <Modal.Header closeButton>
        <Modal.Title>Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="p-3">
            <div data-text-align="center">
              <Image src={data?.name?.image} alt={data?.name?.title} style={{maxWidth: '230px'}}></Image>
            </div>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Product name:</Col>
              <Col><span>{data?.name?.title}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Price:</Col>
              <Col><span>{data?.price}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">In activity:</Col>
              <Col><span>{data?.inPages ? "Yes" : "No"}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Categories: </Col>
              <Col><span>{data?.categories.join(" > ")}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Inspected: </Col>
              <Col><span>{data?.hasAccepted ? "Yes" : "No"}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Types: </Col>
              <Col><span>{data?.['product catalog'].join(", ")}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Classifies: </Col>
              <Col><span>{data?.['product classifies'].map((classify, index) =>{
                return `${classify.title} - ${classify.subtitle}`;
              }).join(", ")}</span></Col>
            </Row>
            <Row className='pb-3'>
              <Col xs="auto" sm="4" md="3" lg="3">Reviewed: </Col>
              <Col><span>{data?.reviewAmount}</span></Col>
            </Row>
          </Container>
        </Modal.Body>
      </>)
    },
    handlerDelete(){
      this.load();
      productAPIInstance.deleteProduct(state.data?.[state.currentIndex]?.id).then(response =>{
        toast.success(response.data);
      }).catch(error =>{
        if(error instanceof AxiosError){
          toast.error(error.response?.data);
          return;
        }
        toast.error("Error from server");
      }).finally(() =>{
        setState(o => ({...o, loading: false,showModal: false}));
      });
    },
    load(){
      setState(o => ({...o, loading:true}));
    },
  }
  
  return (<section>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 1.2rem'
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
      onRead={(rowNumber) =>{
        // console.log("Read",state.data[rowNumber]);
        setState(o => ({...o,showModal: true, currentIndex: rowNumber, mode: "read"}));
      }}
      // onUpdate={(rowNumber) =>{
      //   // console.log("Update",state.data[rowNumber]);
      //   setState(o => ({...o,showModal: true, currentIndex: rowNumber, mode: "update"}));
      // }}
      onDelete={(rowNumber) =>{
        // console.log("Deleted", state.data[rowNumber]);
        setState(o => ({...o,showModal: true, currentIndex: rowNumber, mode: "delete"}));
      }}
    ></Product.ProductTable>

    <Modal show={state.showModal} onHide={() => setState(o => ({...o, showModal: false}))}>
      {
        state.mode === "delete" ? functions.componentDelete() 
        : state.mode === "read" ? functions.componentRead()
        : state.mode === "update"? functions.componentUpdate()
        : <>Nothing</>
      }
    </Modal>
  </section>
  )
}
