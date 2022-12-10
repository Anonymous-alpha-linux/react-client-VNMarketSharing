import React from 'react';
import {Spinner} from 'react-bootstrap';
import {Account} from '../../containers';
import { screenType, useResponsive, useTypedSelector } from '../../hooks';

export const AccountPage = ({children}: {children:React.ReactNode}) => {
    const screen = useResponsive();
    return <>
        <Account.AccountSidebarLinks>
            <div className={`${screen <= screenType["mobile"] ? "container" : "p-3"}`}>
                {children}
            </div>
        </Account.AccountSidebarLinks>
    </>
}
