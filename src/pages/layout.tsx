import React from 'react';
import axios from 'axios';
import {Spinner} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../hooks';
import {AppLocalStorage} from '../config';
import { getCookie } from '../utils';
import { PostProductClassifyDetailRequestDTO} from '../models';
import compressImage from 'browser-image-compression';

export const Layout: React.FC<{children: any}> = ({children}) => {
  const [localStorageUser, setLocalStorageUser] = React.useState(AppLocalStorage.getLoginUser());
  const {data: {productList, max, page, take}} = useTypedSelector(s => s.product);
  const {data: {categoryList, page: categoryPage}, error: categoryError} = useTypedSelector(s => s.category);
  const {data: {userId}} = useTypedSelector(s => s.user);
  const {getUser, postNewProduct, getProductList, getCategoryList, getAddressList, getUserInfo, getSellerInfo} = useActions();
  const {loading, data } = useTypedSelector(state => state.auth);
  const {data: sellerData} = useTypedSelector(state => state.seller); 

  const _isMounted = React.useRef<boolean>(false);
  const _hasGotProduct = React.useRef<boolean>(false);
  const _hasGotCategory = React.useRef<boolean>(false);

  // Mounting
  React.useEffect(()=>{
    _isMounted.current = true;
    return() =>{
      _isMounted.current = false;
    }
  },[])
  
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
          _hasGotProduct.current = true;
      }

      return () =>{
          cancelSource.cancel();
      }
  },[productList]);

  React.useEffect(() =>{
    const cancelSource = axios.CancelToken.source();
    if(!_hasGotCategory.current && categoryList.length === 0 && !categoryError){
      getCategoryList({
        cancelToken: cancelSource.token
      });
      _hasGotCategory.current = true;
    }
    
    return () =>{
      cancelSource.cancel();
    }
  }, [categoryPage]);

  // User persistent
  React.useEffect(()=>{
    if(localStorageUser){
      getUser();
      getUserInfo();
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
      getSellerInfo(Number(userId));
    }
  },[userId])


  if(loading && !_isMounted.current) return <Spinner animation='border' role='status'></Spinner>

  return (
    children
  )
}