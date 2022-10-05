import axios from 'axios';
import React from 'react';
import { Image, Row, Col, Button, Tabs, Tab, Form } from 'react-bootstrap';
import { BsCartPlusFill } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { GrTransaction } from 'react-icons/gr';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CustomLink, Rating, Slider } from '../../components';
import { productAPIInstance,addressAPIInstance } from '../../config';
import { axiosErrorHandler, useActions, useTypedSelector } from '../../hooks';
import { GetAddressResponseDTO, GetProductClassifyDetailResponseDTO, GetProductResponseDTO } from '../../models';
import "./single-product.css";

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

// interface ISingleItemStateData{
//   id: number;
//   name: string;
//   price: number;
//   inventory: number;
//   inPages: boolean;
//   description: string;
//   soldQuantity: number;
// }
interface ISingleProductState {
  loading: boolean;
  data: GetProductResponseDTO | null;
  currentImageUrlIndex: number;
  addressList: GetAddressResponseDTO[];
  selectedClassifyTypes?: (number | undefined)[];
  selectedDetail?: GetProductClassifyDetailResponseDTO;
  selectedDetailIndex?: number;
  selectedAddressId: number;
}
export function SingleProduct() {
  const {data: {userId, addressList}} = useTypedSelector(s => s.user);
  const {id} = useParams();
  const {addToCart} = useActions();
  const location = useLocation();
  const navigate = useNavigate();
  const [state,setState] = React.useState<ISingleProductState>({
    loading: false,
    data: null,
    currentImageUrlIndex: 0,
    selectedClassifyTypes: [],
    selectedAddressId: 0,
    addressList: [],
  });
  const [key, setKey] = React.useState<string>("photo");
  const [key2, setKey2] = React.useState<string>("description");

  function setStateData(data:GetProductResponseDTO) {
    setState(o => {
      const detail = data.productDetails?.at(0);
      return {
        ...o,
        loading: false,
        data: data,
        selectedClassifyTypes: [detail?.productClassifyKeyId, detail?.productClassifyValueId],
        selectedDetail: data.productDetails?.[0],
        selectedDetailIndex: 0
      }
    });
  }
  function setAddressList(addressList: GetAddressResponseDTO[]){
    const addressId = addressList.find(a => a.addressType === 1 && a.isDefault)?.id;
    if(addressId){
      setState(o =>({
        ...o,
        addressList: addressList,
        selectedAddressId: addressId
      }));
    }
  }
  function setAddressId(addressId: number){
    setState(o =>({
      ...o,
      selectedAddressId: addressId
    }));
  }

  React.useEffect(() =>{
    const cancelSource = axios.CancelToken.source();
    id && axiosErrorHandler(() => {
      productAPIInstance.getProductItem(parseInt(id),{
        cancelToken: cancelSource.token
      }).then(response =>{
        setStateData(response.data);
      });
    }, error => {
      navigate(-1);
    }); 
    return () => {
      cancelSource.cancel();
    }
  },[location]);

  React.useEffect(() => {
    setState(o =>{
      let detailIndex = o.selectedDetailIndex;

      const selectedDetail = o.data?.productDetails.find((detail, index) => {
        let isCorrectObject = detail.productClassifyKeyId === o?.selectedClassifyTypes?.[0];
        if(isCorrectObject && o.selectedClassifyTypes?.[1]){
          isCorrectObject = detail.productClassifyValueId === o?.selectedClassifyTypes?.[1];
        }
        if(isCorrectObject) {
          detailIndex = index;
        }
        return isCorrectObject;
      });

      return {
        ...o,
        selectedDetailIndex: detailIndex,
        selectedDetail: selectedDetail
      }
    });
  },[state.selectedClassifyTypes]);

  React.useEffect(() =>{
    if(addressList){
      setAddressList(addressList);
    }
  }, [addressList]);

  return (
    <section className="p-5">
      <Row>
        <Col sm="auto" className="pb-3" style={{
          display:'inline-block',
          background: '#fff',
          maxWidth:"32rem"
        }}>
            <div style={{
              background: `url(${state.data?.urls && state.data.urls.at(state.currentImageUrlIndex) || defaultAvatar}) center / 100% no-repeat`,
              width:"320px",
              height: "420px"
            }}></div>
          <Tabs id="controlled-tab-single-product"
              activeKey={key}
              onSelect={(k) => k && setKey(k)}
              className="mb-3">
            <Tab eventKey="photo" title="Photo">
              <Slider dataNumber={state.data?.urls?.length || 0} 
                    itemAmountPerTime={3}
                    loadNextItemAmount={1}
                    itemArray={state.data?.urls || []}
                    className="row row-cols-xs-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-4 row-cols-xl-4"
                    cardNode={(image) => <>
                        <img src={image} width={"120px"} height={"120px"}></img>
                    </>}
                ></Slider>
            </Tab>
            <Tab eventKey="video" title="Video" disabled>Video</Tab>
          </Tabs>
        </Col>
        <Col>
          <article id="single-product__header">
            <h3>{state.data?.name}</h3>
            <div>
              <Rating.Star percentage={0.7}></Rating.Star>
              <i style={{marginLeft:"0.5rem", verticalAlign: 'middle'}}>No reviews yet</i>
              <a href="#last">
                <b style={{marginLeft:"1.2rem", verticalAlign: 'middle'}}>Write a review</b>
              </a>
            </div>

            <h4 style={{ marginTop: '1.8rem', color: "red"}}>
              <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>
                {state.selectedDetail?.price || state.data?.price?.toFixed(2)}
              </i>    
              {state.selectedDetail?.price || state.data?.price?.toFixed(2)}đ
            </h4>
            <p>(You save {"20%"})</p>
          </article>

          <article id="single-product__classifies">
            <div>
              {
                state.data?.productClassifies.map((classify, classifyIndex) =>{
                  return <div className='single-product__container--classifies' key={classifyIndex + 1}>
                    <h4>{classify.name}</h4>
                    <Row>
                      {classify.classifyTypes.map((type,typeIndex) =>{
                      return <Col sm="auto" key={typeIndex + 1}>
                        <span className="single-product__button--classify" 
                        onClick={() => { 
                          setState(o =>{
                            const selectedClassifyTypes = o?.selectedClassifyTypes?.map((id,index) => index !== classifyIndex ? id : type.id);
                            return {
                              ...o,
                              selectedClassifyTypes: selectedClassifyTypes
                            }
                          }); 
                        }}
                        aria-selected={!!state?.selectedClassifyTypes && type.id === state.selectedClassifyTypes[classifyIndex]}>
                          {type.name}
                        </span> 
                      </Col>
                      })}
                    </Row>
                  </div>
                })
              }
            </div>
            <div></div>
          </article>

          <article id="single-product__infors"
          style={{width: '100%'}}>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <b>SKU:</b>
              </Col>
              <Col>CTC</Col>
            </Row>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <b>Weight:</b>
              </Col>
              <Col>2.2 LBS</Col>
            </Row>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <b>Gift wrapping:</b>
              </Col>
              <Col>Options available</Col>
            </Row>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <b>Shipping:</b>
              </Col>
              <Col>Trading</Col>
            </Row>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <label>Categories: </label>
              </Col>
              <Col>
                <b>
                {state.data?.productCategories.map(pc => pc.name).join(" > ")}
                </b>
              </Col>
            </Row>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <label>Address: </label>
              </Col>
              <Col>
                <Form.Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddressId(parseInt(e.target.value))}>
                    {addressList.map((address,index) =>{
                        return <option value={address.id} key={index}>
                            {`${address.receiverName} - ${address.streetAddress} - ${address.ward} - ${address.district} - ${address.city}`}
                        </option>
                    })}
                </Form.Select>
              </Col>
            </Row>
          </article>

          <article className="pt-2">
            <Row>
              <Col sm="auto">
                <Button className="single-product__button--cart"
                  variant="primary"
                  onClick={() => state.data 
                  && addToCart(state.data, state.selectedAddressId, state.selectedDetailIndex)}>
                    {state.data?.inventory && state.data.inventory > 0 ? <>
                    <div data-text-align="middle">
                      <BsCartPlusFill></BsCartPlusFill> 
                    </div>
                    <div>
                        ADD TO CART
                    </div>
                </>
                : "OUT OF STOCK" }</Button>
              </Col>
              <Col>
                <Button style={{display: 'flex', gap: '0.4rem'}}>
                  <div>
                    <GrTransaction></GrTransaction>
                  </div>
                  <div>
                    Purchase
                  </div>
                </Button>
              </Col>
              <Col>
                <Button style={{background:"transparent", outline:'none', border: 'none', color:'red', fontSize:'1.2rem'}}>
                    <FaHeart></FaHeart>
                    <b style={{verticalAlign: 'middle', marginLeft: '1rem', fontSize:"1rem"}}>ADD TO WISHLIST</b>
                </Button>
              </Col>
            </Row>
          </article>
        </Col>
      </Row>
      <div>
        <Image src={state.data?.userPage?.pageAvatar}></Image>
        <i>{state.data?.userPage?.name}</i>
      </div>

      <div id="last">
        <Tabs id="controlled-tab-single-product"
              activeKey={key2}
              onSelect={(k) => k && setKey2(k)}
              className="mb-3">
            <Tab eventKey="description" title="DESCRIPTION">
              <textarea value={state.data?.description} 
                style={{
                  resize: 'none',
                  width: '100%',
                  height: "800px",
                }} 
                readOnly></textarea>
            </Tab>
            <Tab eventKey="review" title="REVIEWS (5)">Review</Tab>
            <Tab eventKey="shipping" title="SHIPPING & RETURN (5)">{"Shipping & Return"}</Tab>
          </Tabs>
      </div>
    </section>
  )
}
