import axios from 'axios';
import React from 'react';
import { Row, Col, Button, Tabs, Tab, Form, Container } from 'react-bootstrap';
import { BsCartPlusFill } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { GrTransaction } from 'react-icons/gr';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Rating, Slider } from '../../components';
import { productAPIInstance, ReviewHub } from '../../config';
import { Chat } from '../../containers';
import { axiosErrorHandler, screenType, useActions, useResponsive, useTypedSelector } from '../../hooks';
import { GetAddressResponseDTO, GetProductClassifyDetailResponseDTO, GetProductResponseDTO, ReviewProductCreationDTO, ReviewProductResponseDTO } from '../../models';
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
  displayImage: string;
  currentImageUrlIndex: number;
  addressList: GetAddressResponseDTO[];
  selectedClassifyTypes?: (number | undefined)[];
  selectedDetail?: GetProductClassifyDetailResponseDTO;
  selectedDetailIndex?: number;
  selectedAddressId: number;
  selectedImageIndex: number;
}

export function SingleProduct() {
  const {data: {userId, addressList}} = useTypedSelector(s => s.user);
  const {addToCart} = useActions();
  const locationParams = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [state,setState] = React.useState<ISingleProductState>({
    loading: false,
    data: null,
    displayImage: defaultAvatar,
    currentImageUrlIndex: 0,
    selectedClassifyTypes: [],
    selectedAddressId: 0,
    addressList: [],
    selectedImageIndex: 0
  });
  const [key, setKey] = React.useState<string>("photo");
  const [key2, setKey2] = React.useState<string>("description");
  const screen = useResponsive();

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
    if(locationParams.id){
      const {id} = locationParams;
      axiosErrorHandler(() => {
        productAPIInstance.getProductItem(parseInt(id),{
          cancelToken: cancelSource.token
        }).then(response =>{
          setStateData(response.data);
        });
      }, error => {
        navigate(-1);
      }); 
    }
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

  React.useEffect(() => {
    setState(o =>({
      ...o,
      displayImage: o.data?.urls?.at?.(o.currentImageUrlIndex) || defaultAvatar
    }));
  }, [state.data?.urls, state.currentImageUrlIndex])

  return (
    <section className="py-5">
      <Container>
        <Row>
          <Col sm="auto" className="pb-3" style={{
            display:'inline-block',
            background: '#fff',
            maxWidth:"32rem"
          }}>
              <div style={{
                background: `url(${state.displayImage}) center / 100% no-repeat`,
                width:"320px",
                height: "420px",
                margin: "0 auto"
              }}></div>
            <Tabs id="controlled-tab-single-product"
                activeKey={key}
                onSelect={(k) => k && setKey(k)}
                className="mb-3">
              <Tab eventKey="photo" title="Photo">
                <Slider dataNumber={state.data?.urls?.length || 0} 
                    itemAmountPerTime={screen === screenType["medium"] ? 2 : 3}
                    loadNextItemAmount={1}
                    itemArray={state.data?.urls || []}
                    className="row row-cols-xs-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-3"
                    cardNode={(image,index) => <div data-text-align="center" onClick={() =>{setState(o =>({...o, currentImageUrlIndex: index}))}}>
                        <img src={image} width={"120px"} height={"120px"} style={{margin: '0 auto', border: '1px solid black'}}></img>
                    </div>}
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
                {
                  state.data?.reviewAmount &&
                  <i style={{marginLeft:"0.5rem", verticalAlign: 'middle'}}>{`${state.data.reviewAmount} Customer Reviews`}</i> ||
                  <i style={{marginLeft:"0.5rem", verticalAlign: 'middle'}}>No reviews yet</i>
                }
                <a href="#last">
                  <b style={{marginLeft:"1.2rem", verticalAlign: 'middle'}}>Write a review</b>
                </a>
              </div>

              <h4 style={{ marginTop: '1.8rem', color: "red"}}>
                <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>
                  {state.selectedDetail?.price?.toLocaleString("en-US", {
                      maximumFractionDigits: 0
                  }) || state.data?.price?.toLocaleString("en-US", {
                      maximumFractionDigits: 0
                  })}
                </i>    
                {state.selectedDetail?.price?.toLocaleString("en-US", {
                  maximumFractionDigits: 0
                }) || state.data?.price?.toLocaleString("en-US", {
                  maximumFractionDigits: 0 
                })}đ
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
                                selectedClassifyTypes: selectedClassifyTypes,
                                displayImage: state.data?.productDetails?.find?.(p => !!selectedClassifyTypes?.[0] && p.productClassifyKeyId === selectedClassifyTypes?.[0])?.presentImage || o.displayImage,
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
                <Col xs="auto" sm={3} md={3}>
                  <label>Address: </label>
                </Col>
                <Col>
                  <Form.Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddressId(parseInt(e.target.value))}>
                      {addressList.map((address,index) =>{
                          return <option value={address.id} key={index + 1}>
                              {`${address.receiverName} - ${address.streetAddress} - ${address.ward} - ${address.district} - ${address.city}`}
                          </option>
                      })}
                  </Form.Select>
                </Col>
              </Row>
            </article>

            <article className="pt-2">
              <Row xs={1} sm={2}>
                <Col xs="12" sm="auto">
                  <Button className="single-product__button--cart"
                    variant="primary"
                    onClick={() => {
                      state.data && addToCart(state.data, state.selectedAddressId, state.selectedClassifyTypes)}}>
                      {state.data?.inventory && state.data.inventory > 0 ? <>
                      <div data-text-align="middle" style={{height:"100%"}}>
                        <BsCartPlusFill></BsCartPlusFill> 
                      </div>
                      <div>
                          ADD TO CART
                      </div>
                  </>
                  : "OUT OF STOCK" }</Button>
                </Col>
                <Col>
                  <Button className="single-product__button--checkout" style={{display: 'flex', gap: '0.4rem'}}>
                    <div>
                      <GrTransaction></GrTransaction>
                    </div>
                    <div>
                      Checkout
                    </div>
                  </Button>
                </Col>
                <Col>
                  <Button className="single-product__button--wish" style={{background:"transparent", outline:'none', border: 'none', color:'red', fontSize:'1.2rem'}}>
                      <FaHeart></FaHeart>
                      <b style={{verticalAlign: 'middle', marginLeft: '1rem', fontSize:"1rem"}}>ADD TO WISHLIST</b>
                  </Button>
                </Col>
              </Row>
            </article>
          </Col>
        </Row>

        <Row id="single-product__merchant" className="p-3 my-2">
          <Col xs="auto" sm="auto">
            <div className='me-3' style={{background: `url(${state.data?.userPage?.pageAvatar}) center / 100% no-repeat`, width: '80px', height:'80px', borderRadius: '50%', display: 'inline-block'}}></div>
          </Col>
          <Col xs="auto" sm="auto">
            <h4 style={{display: 'inline-block'}}>{state.data?.userPage?.name}</h4>
          </Col>
          <Col xs="auto" sm="auto">
            <div>product:</div>
          </Col>
        </Row>

        <div id="last">
          <Tabs id="controlled-tab-single-product"
          activeKey={key2}
          onSelect={(k) => k && setKey2(k)}
          className="mb-3">
            <Tab eventKey="description" title="DESCRIPTION">
              <textarea value={state.data?.description} 
                className="p-3"
                style={{
                  borderRadius: '12px',
                  resize: 'none',
                  width: '100%',
                  height: "800px",
                }} 
                readOnly></textarea>
            </Tab>
            <Tab eventKey="review" title={`REVIEWS (${state.data?.reviewAmount})`}>
              <ReviewSection 
              productId={Number(locationParams.id) || 0} 
              merchantId={state.data?.userPage.id || 0}
              userId={Number(userId)}></ReviewSection>
            </Tab>
            <Tab eventKey="shipping" title="SHIPPING & RETURN">
              <section className="p-3" style={{background: '#fff'}}>
                <h4>
                  RETURNS POLICY
                </h4>
                <article>
                  <p>
                    You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).
                  </p>

                  <p>
                    You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly. This time period includes the transit time for us to receive your return from the shipper (5 to 10 business days), the time it takes us to process your return once we receive it (3 to 5 business days), and the time it takes your bank to process our refund request (5 to 10 business days).
                  </p>

                  <p>
                    If you need to return an item, simply login to your account, view the order using the "Complete Orders" link under the My Account menu and click the Return Item(s) button. We'll notify you via e-mail of your refund once we've received and processed the returned item.
                  </p>
                </article>
                <h4>
                  SHIPPING
                </h4>
                <article>
                  <p>
                    We can ship to virtually any address in the world. Note that there are restrictions on some products, and some products cannot be shipped to international destinations.
                  </p>

                  <p>
                    When you place an order, we will estimate shipping and delivery dates for you based on the availability of your items and the shipping options you choose. Depending on the shipping provider you choose, shipping date estimates may appear on the shipping quotes page.
                  </p>

                  <p>
                    Please also note that the shipping rates for many items we sell are weight-based. The weight of any such item can be found on its detail page. To reflect the policies of the shipping companies we use, all weights will be rounded up to the next full pound.
                  </p>
                </article>
              </section>
            </Tab>
          </Tabs>
        </div>
      </Container>
    </section>
  )
}

type ReviewSectionState = {
  reviewList: ReviewProductResponseDTO[];
  connection: ReviewHub | null;
}

export function ReviewSection(props: {productId: number, userId: number, merchantId: number}){
  const [state, setState] = React.useState<ReviewSectionState>({
    reviewList: [],
    connection: null
  });

  React.useEffect(() =>{
    setState(o =>({
      ...o,
      connection: new ReviewHub(),
    }))
  },[]);
  // Review hub socket connection
  React.useEffect(()=>{
    if(state.connection){
      state.connection.connect({
        onConnected(hub) {
          console.info(`Connected to ${hub.getHubName()}`);
          hub.joinReviewGroup(props.productId).then(() =>{
            console.info('joined room successfully');
          });
          hub.receiveReviewFromBuyer(newReview =>{
            if(newReview){
              insertOrUpdateReview(newReview);
              return;
            }
            toast.error("Not received any new review");
          });
        },
        onFailed(message){
          toast.error(message);
        },
        onReconnected(hub) {
          hub.joinReviewGroup(props.productId).then(() =>{
            console.info('Returned room successfully');
          });
          hub.receiveReviewFromBuyer(newReview =>{
            if(newReview){
              insertOrUpdateReview(newReview);
              return;
            }
            toast.error("Not received any new review");
          });
        },
        onClose(hub) {
          console.warn(`Leaved ${hub.getHubName()}`);
          hub.leaveReviewGroup(props.productId);
        }
      });
    }

    return () =>{
      state.connection && state.connection.disconnect();
    }
  },[state.connection]);

  // Get Review List
  React.useEffect(() =>{
    if(props.productId){
      axiosErrorHandler(() =>{
        productAPIInstance.getReviewProduct(props.productId)
          .then(response =>{
            const {data} = response;
            if(typeof data === "object" && data.hasOwnProperty("result")){
              const {result} = data;
              setState(o =>({
                ...o,
                reviewList: result
              }))
            }
          });
      });
    }
  }, [props.productId]);

  function sendReview(review: ReviewProductCreationDTO){
    if(state.connection && state.connection.hasConnected()){
      state.connection.sendReviewToMerchant(review, props.merchantId).then(() =>{
        toast.success("Sent message");
      });
    }
    else{
      toast.error("You cannot comment now!");
    }
  }

  function insertOrUpdateReview(updatedReview: ReviewProductResponseDTO){
    setState(o =>{
      const existingReviewIndex = o.reviewList.findIndex(p => p.id === updatedReview.id);
      const oldReviewList = o.reviewList;

      if(existingReviewIndex < 0){
        return {
          ...o,
          reviewList: [updatedReview,...oldReviewList]
        }
      }
      return {
        ...o,
        reviewList: oldReviewList.map((review,index) => index === existingReviewIndex? updatedReview : review)
      };
    });
  }

  return (
    <section>
      <Chat.MessageContainer 
        onSubmitForm={(formValues) =>{
          sendReview(formValues);
        }}
        messages={state.reviewList.map((r) =>{
          return {
            replyAmount: r.replyAmount,
            subject: r.subject,
            image: r.user.avatar,
            isMine: props.userId === r.user.id,
            message: r.comment,
            name: r.name,
            time: r.createdAt,
            star: r.rate / 5,
            replyList: r.replies.map(p => ({
              image: p.userPage.pageAvatar,
              name: p.userPage.name,
              message: p.comment,
              time: p.createdAt
            }))
          }
        })} 
        user={{
          id: props.userId,
          image: 'https://cdn-icons-png.flaticon.com/512/21/21104.png',
          name: 'user',
          status: 'online'
        }} 
        productId={props.productId}
        ></Chat.MessageContainer>
    </section>
  )
}
