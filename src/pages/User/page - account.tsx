import React from 'react';
import {Spinner} from 'react-bootstrap';
import {Account} from '../../containers';
import { screenType, useResponsive, useTypedSelector } from '../../hooks';

export const AccountPage = ({children}: {children:React.ReactNode}) => {
    const {loading} = useTypedSelector(state=> state.user);
    const screen = useResponsive();
    return <>
            <Account.AccountSidebarLinks>
            {
                loading 
                ? (<Spinner animation="border"></Spinner>) 
                : (<div className={`${screen <= screenType["mobile"] ? "container" : "p-3"}`}>
                    {children}
                </div>)
            }
            </Account.AccountSidebarLinks>
    </>
}
