import React from 'react'
import { GetProductResponseDTO } from '../../models';
import { ProductTableAdapter } from './adapter - productTable';
import { productAPIInstance } from '../../config';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Col, Image, Modal, Row } from 'react-bootstrap';
import './index.css';
import { Slider } from '../../components';

export function ProductInspectPage() {
  const [state, setState] = React.useState<ProductInspectPageState>({
    data: [],
    loading: false
  });
  const [displayedModal, displayModal] = React.useState(false);

  const readItemRef = React.useRef<number>(0);

  const functions = {
    fetchProductList(){
      productAPIInstance.getUnInspectedProducts()
        .then(response =>{
          if(Array.isArray(response.data)){
            setState(o =>({
              ...o,
              data: response.data
            }));
          }
        }).catch(error =>{
          if(error.response){
            toast.error(error.response.data);
          }
        });
    },
    updateHasAcceptProduct(productId: number, isAccepted: boolean){
      setState(o =>({
        ...o,
        data: state.data.map(item =>{
          if(item.id === productId){
            return {
              ...item,
              hasAccepted: isAccepted
            }
          }
          return item;
        })
      }));
    },
    inspectItem(isAccepted: boolean, rowIndex: number){
      const acceptedItem = state.data.at?.(rowIndex);
      if(acceptedItem){
        productAPIInstance.permitProductByAdmin(isAccepted, acceptedItem.id).then(response =>{
          toast.success(response.data?.message || "Inspected Product Success");
          this.updateHasAcceptProduct(acceptedItem.id, isAccepted);
        }).catch(error =>{
          toast.error(error?.response?.data);
        });
      }
    },
    renderProductDetail(){
      const data = state.data[readItemRef.current];
      return (
        <Modal show={displayedModal} onHide={() => displayModal(false)}>
          <Modal.Header closeButton>
            Product detail
          </Modal.Header>
          <Modal.Body>
            <section className='product-detail__section'>
              <Row>
                <Col>
                  <Slider
                    cardNode={(item) => {
                      return <Image src={item} style={{width: '100%'}}></Image>
                    }}
                    dataNumber={data?.urls.length}
                    itemAmountPerTime={1}
                    itemArray={data?.urls}
                    loadNextItemAmount={1}
                    responsive={{
                      xs: {
                        itemAmountPerTime: 1,
                        loadNextItemAmount: 1
                      },
                      sm: {
                        itemAmountPerTime: 1,
                        loadNextItemAmount: 1
                      },
                      md: {
                        itemAmountPerTime: 2,
                        loadNextItemAmount: 1
                      },
                      lg: {
                        itemAmountPerTime: 2,
                        loadNextItemAmount: 1
                      },
                      xl: {
                        itemAmountPerTime: 2,
                        loadNextItemAmount: 1
                      },
                      xxl: {
                        itemAmountPerTime: 2,
                        loadNextItemAmount: 1
                      }
                    }}
                  ></Slider>
                </Col>
              </Row>
              <Row xs={12} sm={2} className="pt-4">
                <Col xs={2} sm={3}>Product No:</Col>
                <Col>{data?.id}</Col>
              </Row>
              <Row xs={12} sm={2} className="pt-4">
                <Col xs={2} sm={3}>Product Name:</Col>
                <Col>{data?.name}</Col>
              </Row>
              <Row xs={12} sm={2} className="pt-4">
                <Col xs={2} sm={3}>Classify List:</Col>
                <Col>
                  <ul className='product-detail__ul'>
                    {data?.productClassifies.map((c,index) =>{
                      return <li key={index} style={{textDecorationStyle: 'dotted'}}>{c.name}</li>
                    })}
                  </ul>
                </Col>
              </Row>
              <Row xs={12} sm={2} className="pt-4">
                <Col xs={2} sm={3}>Classify Detail:</Col>
                <Col xs="auto" sm="auto">{data?.productDetails.map((detail, index) =>{
                  return <div key={index}>
                    <Row xs={2} sm={2}>
                      <Col xs="auto" sm="auto">
                        <Image src={detail.presentImage} style={{width: '80px'}}></Image>
                      </Col>
                      <Col>
                        <div>
                          <Row xs={2} sm={2}>
                            <Col xs={5} sm={5}>
                              {data?.productClassifies?.at?.(0)?.name} :
                            </Col>
                            <Col>
                              {detail.productClassifyKey}
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={5} sm={5}>
                              {data?.productClassifies?.[1]?.name} :
                            </Col>
                            <Col>{detail.productClassifyValue}</Col>
                          </Row>
                          <Row>
                            <Col xs="auto" sm="auto">
                              Inventory:
                            </Col>
                            <Col>
                              <i>
                                {detail.inventory} units
                              </i>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="auto" sm="auto">
                              Price:
                            </Col>
                            <Col>
                              <i>
                                {detail.price.toLocaleString("en-US")} VND
                              </i>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                })}</Col>
              </Row>
            </section>
          </Modal.Body>
        </Modal>
      )
    }
  }

  React.useEffect(() =>{
    functions.fetchProductList();
  },[]);

  return (
  <section className="p-4">
    <article className='p-3'>
      <h3>Product Inspect</h3>
      <i>Let check some product</i>
    </article>
    <ProductTableAdapter 
      data={state.data.map(item =>{
        const {
          name,
          productCategories, 
          soldQuantity, 
          userPage,
          reviewAmount,
          productDetails,
          productClassifies,
          urls,
          price, 
          inventory,
          createdAt,
          inPages,
          id,
          description} = item;
        return {
          "no": id,
          "name": {
            title: name,
            image: urls[0]
          },
          "classifies": productClassifies.map(c =>{
            return {
              title: c.name,
              "types": c.classifyTypes.map(type =>{
                return type.name
              })
            }
          }),
          "image": urls.map(url => ({
            title: '',
            image: url
          })),
          "detail": productDetails.map(detail =>{
            return {
              title: detail.productClassifyKey || detail.productClassifyValue,
              image: detail.presentImage,
              subtitle: detail.inventory
            }
          }),
          "posted": moment(createdAt).format("DD/MM/YYYY hh:mm:ssa"),
          "status": {
            status: item.hasAccepted ? "success" : "danger",
            title: item.hasAccepted ?"Accepted" : "Not Accepted"
          },
          description,
        }
      })}
      headers={["no", "name", "classifies", "image", "detail", "posted", "status", "description"]}
      hasAction
      onAccept={(rowIndex) => functions.inspectItem(true, rowIndex)}
      onDeny={(rowIndex) => functions.inspectItem(false, rowIndex)}
      onRead={(rowNumber) => {
        readItemRef.current = rowNumber;
        displayModal(true);
      }}
    ></ProductTableAdapter>
    {functions.renderProductDetail()}
  </section>
  )
}

type ProductInspectPageState = {
  data: GetProductResponseDTO[];
  loading: boolean;
}