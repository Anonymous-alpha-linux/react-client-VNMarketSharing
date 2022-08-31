import axios from 'axios';
import React from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPIInstance } from '../../config';
import { axiosErrorHandler } from '../../hooks';
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
  const navigate = useNavigate();
  const [state,setState] = React.useState<Partial<ISingleItemState>>({
    loading: false,
    data: null
  });

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
      navigate(-1)
    }); 
    return () => {
      cancelSource.cancel();
    }
  },[]);

  return (
    <>
      <p>{JSON.stringify(state.data)}</p>
      <div>
        <img width={'120px'} src={state.data?.urls && state.data.urls.at(0) || defaultAvatar}></img>
        <h1>{state.data?.name}</h1>
        <p>{state.data?.price}đ</p>
        <p>Status: {state.data?.inventory && state.data.inventory > 0 ? "Good" : "Out of range" }</p>
      </div>

      <div>
        <label>Categories: </label>
        <b>
        {state.data?.productCategories.map((c,idx) => {
          return <span key={c.id}>{c.name}</span>
        })}
        </b>
      </div>
      
      <div>
        <Image src={state.data?.userPageAvatar}></Image>
        <i>{state.data?.userPageName}</i>
      </div>

      <div>
        <textarea value={state.data?.description} style={{
          resize: 'none'
        }} readOnly></textarea>
      </div>
    </>
  )
}
