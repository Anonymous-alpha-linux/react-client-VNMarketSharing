import React from 'react';
import {Spinner} from 'react-bootstrap';
import {useActions, useTypedSelector} from '../hooks';
import {AppLocalStorage,chatHubConnection} from '../config';

export const Layout: React.FC<{children: any}> = ({children}) => {
  const [localStorageUser] = React.useState(AppLocalStorage.getLoginUser());
  const {getUser} = useActions();
  const {loading} = useTypedSelector(state => state.auth);

  const _isMounted = React.useRef<boolean>(false);
  React.useEffect(()=>{
    _isMounted.current = true;
  },[])

  React.useEffect(()=>{
    if(localStorageUser){
      getUser();
    }
  },[localStorageUser]);

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

  if(loading && !_isMounted.current) return <Spinner animation='border' role='status'></Spinner>

  return (
    children
  )
}