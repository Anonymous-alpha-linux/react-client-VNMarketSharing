import React from 'react';
import {Spinner} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../hooks';
import {AppLocalStorage,chatHubConnection} from '../config';
import { getPhoto } from '../utils';
import { PostProductClassifyDetailRequestDTO} from '../models';
import compressImage from 'browser-image-compression';

export const Layout: React.FC<{children: any}> = ({children}) => {
  const [localStorageUser] = React.useState(AppLocalStorage.getLoginUser());
  const {getUser, postNewProduct} = useActions();
  const {loading} = useTypedSelector(state => state.auth);

  const _isMounted = React.useRef<boolean>(false);

  // Mounting
  React.useEffect(()=>{
    _isMounted.current = true;
    return() =>{
      _isMounted.current = false;
    }
  },[])

  // User persistent
  React.useEffect(()=>{
    if(localStorageUser){
      getUser();
    }
  },[localStorageUser]);

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
      // const formRequest = AppLocalStorage.getPostProductForm();
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

        // console.log(newFiles, newProductDetail);
        // postNewProduct({
        //   ...rest,
        //   files: new Set<File>(newFiles),
        //   productDetails: newProductDetail
        // });
      }
      else 
        console.log("No form to post");
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


  if(loading && !_isMounted.current) return <Spinner animation='border' role='status'></Spinner>

  return (
    children
  )
}