import axios from 'axios';
import React from 'react';
import { Image, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import { BsCartPlusFill } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { Rating, Slider } from '../../components';
import { productAPIInstance } from '../../config';
import { axiosErrorHandler, useActions } from '../../hooks';
import { GetProductResponseDTO } from '../../models';

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
interface ISingleItemState {
  loading: boolean;
  data: GetProductResponseDTO | null;
}
export function SingleItem() {
  const {id} = useParams();
  const {addToCart} = useActions();
  const navigate = useNavigate();
  const [state,setState] = React.useState<ISingleItemState>({
    loading: false,
    data: null
  });
  const [key, setKey] = React.useState<string>("photo");
  const [key2, setKey2] = React.useState<string>("description");

  function setStateData(data:GetProductResponseDTO) {
    setState(o =>({
      ...o,
      loading: false,
      data: data
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
  },[]);

  return (
    <section className="p-5">
      <Row>
        <Col sm="auto" className="pb-3" style={{
          display:'inline-block',
          background: '#fff',
        }}>
          <img style={{
              objectFit:'contain',
              width: '20rem',
              height: '30rem'
            }}
            src={state.data?.urls && state.data.urls.at(0) || defaultAvatar}></img>
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
          <h3>{state.data?.name}</h3>
          <div>
            <Rating.Star></Rating.Star>
            <i style={{marginLeft:"0.5rem", verticalAlign: 'middle'}}>No reviews yet</i>
            <b style={{marginLeft:"1.2rem", verticalAlign: 'middle'}}>Write a review</b>
          </div>
          <p>{state.data?.price}đ</p>
          <h4 style={{ marginTop: '1.8rem', color: "red"}}>
            <i style={{textAlign: 'center', margin: '1.8rem 1.2rem 0 0', textDecorationLine: 'line-through', color:'#b3b3b3'}}>{state.data?.price?.toFixed(2)}</i>    
            {state.data?.price?.toFixed(2)} VND
          </h4>
          <p>(You save {"20%"})</p>
          <article style={{width: '100%'}}>
            <Row sm={2}>
              <Col sm={3} md={3}>
                <b>SKU:</b>
              </Col>
              <Col>CTC</Col>
            </Row>
            <Row>
              <Col sm={3} md={3}>
                <b>Weight:</b>
              </Col>
              <Col>2.2 LBS</Col>
            </Row>
            <Row>
              <Col sm={3} md={3}>
                <b>Gift wrapping:</b>
              </Col>
              <Col>Options available</Col>
            </Row>
            <Row>
              <Col sm={3} md={3}>
                <b>Shipping:</b>
              </Col>
              <Col>Trading</Col>
            </Row>
            <Row>
              <Col sm={3} md={3}>
                <label>Categories: </label>
              </Col>
              <Col>
                <b>
                {state.data?.productCategories.map(pc => pc.name).join(" > ")}
                </b>
              </Col>
            </Row>
          </article>
          <Button onClick={() => state.data && addToCart(state.data)}>{state.data?.inventory && state.data.inventory > 0 ? <>
            <BsCartPlusFill></BsCartPlusFill> ADD TO CART
          </>
          : "OUT OF STOCK" }</Button>
          <Button style={{background:"transparent", outline:'none', border: 'none', color:'red', fontSize:'1.2rem', marginLeft: '2.5rem'}}>
              <FaHeart></FaHeart>
              <b style={{verticalAlign: 'middle', marginLeft: '1rem', fontSize:"1rem"}}>ADD TO WISHLIST</b>
          </Button>
        </Col>
      </Row>

      
      
      <div>
        <Image src={state.data?.userPageAvatar}></Image>
        <i>{state.data?.userPageName}</i>
      </div>

      <div>
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
