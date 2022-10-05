import React from 'react';
import axios from 'axios';
import {Spinner} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../hooks';
import {AppLocalStorage,chatHubConnection} from '../config';
import { getCookie, getPhoto } from '../utils';
import { PostProductClassifyDetailRequestDTO} from '../models';
import compressImage from 'browser-image-compression';

export const Layout: React.FC<{children: any}> = ({children}) => {
  const [localStorageUser, setLocalStorageUser] = React.useState(AppLocalStorage.getLoginUser());
  const {data: {productList, max, page, take}} = useTypedSelector(s => s.product);
  const {data: {categoryList}, error: categoryError} = useTypedSelector(s => s.category);
  const {data: {userId}} = useTypedSelector(s => s.user);
  const {getUser, postNewProduct, getProductList, getCategoryList, getAddressList} = useActions();
  const {loading} = useTypedSelector(state => state.auth);

  const _isMounted = React.useRef<boolean>(false);

  // Mounting
  React.useEffect(()=>{
    _isMounted.current = true;
    return() =>{
      _isMounted.current = false;
    }
  },[])

  // Chat hub socket connection
  React.useEffect(()=>{
    chatHubConnection.connect();
    chatHubConnection.getHubConnection().onreconnecting(()=>{
      console.log("reconnecting");
    });
    chatHubConnection.getHubConnection().onreconnected((connectionId)=>{
      console.log("reconnected");
    });
    return () =>{
      chatHubConnection.disconnect();
    }
  },[chatHubConnection]);

  // Handle Form form localStorage
  React.useEffect(() =>{
    const formRequest = AppLocalStorage.getPostProductForm();
    window.addEventListener('storage', async () => {
      // 1. Submit product form
      if(formRequest){
        const { files, productDetails, ...rest } = formRequest;

        const newFiles = await Promise.all(files.map(file => compressImage.getFilefromDataUrl(
          file, 
          `file-${Math.floor(Math.random() * 1000000)}`)
        ));
        
        const newProductDetail = await Promise.all(productDetails.map(detail =>{
          const {image, ...detailObj} = detail;

          return new Promise<PostProductClassifyDetailRequestDTO>(resolve => {
            compressImage
              .getFilefromDataUrl(image,`file-${Math.floor(Math.random() * 1000000)}`)
              .then(file =>{
                resolve({
                  ...detailObj,
                  image: file
                } as PostProductClassifyDetailRequestDTO)
              })
          });
        }));

        postNewProduct({
          ...rest,
          files: new Set<File>(newFiles),
          productDetails: newProductDetail
        });
      }
    });

    if(formRequest){
      window.dispatchEvent(new Event('storage'));
    }

    return () =>{
      window.removeEventListener('storage', () =>{
        console.log("removed event storage");
      });
    }
  },[]);

  React.useEffect(() => {
      const cancelSource = axios.CancelToken.source();

      // Fetch product data
      if(!max || productList.length < max){
          getProductList({
              page: page,
              take: take
          },{
              cancelToken: cancelSource.token
          });
      }

      return () =>{
          cancelSource.cancel();
      }
  },[productList]);

  React.useEffect(() =>{
    const cancelSource = axios.CancelToken.source();
    if(categoryList.length === 0 && !categoryError){
      getCategoryList({
        cancelToken: cancelSource.token
      });
    }
    
    return () =>{
      cancelSource.cancel();
    }
  }, [categoryList]);

  // User persistent
  React.useEffect(()=>{
    if(localStorageUser){
      getUser();
      return;
    }
    const jwt = getCookie("jwt");
    if(jwt){
      AppLocalStorage.setLoginUser(jwt);
      setLocalStorageUser(AppLocalStorage.getLoginUser());
    }
  },[localStorageUser]);

  React.useEffect(() =>{
    if(userId){
      getAddressList(Number(userId));
    }
  },[userId])


  if(loading && !_isMounted.current) return <Spinner animation='border' role='status'></Spinner>

  return (
    children
  )
}