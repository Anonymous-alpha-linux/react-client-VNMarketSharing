import React from 'react'
import {useActions} from '../hooks';
import {AppLocalStorage} from '../api';

export function Layout({children}: {children: any}) {
  const [localStorageUser, setState] = React.useState(AppLocalStorage.getLoginUser());
  const {getUser} = useActions();

  React.useEffect(()=>{
    if(localStorageUser){
      getUser();
    }
  },[localStorageUser]);

  return (
    children
  )
}