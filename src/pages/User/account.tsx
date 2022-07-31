import React, {useEffect} from 'react';
import {Spinner, Stack} from 'react-bootstrap';
import {Account} from '../../containers';
import { useActions, useTypedSelector } from '../../hooks';

export const AccountPage = ({children}: {children:React.ReactNode}) => {
    const {data: {email}} = useTypedSelector(state => state.auth);
    const {loading} = useTypedSelector(state=> state.user);
    const {getUserInfo} = useActions();

    React.useEffect(() =>{
        getUserInfo();
    },[email]);

    return <Stack direction="horizontal" className="align-items-start">
            <div style={{width: '180px', height: 'fit-content'}}>
                <Account.AccountLinks>
                </Account.AccountLinks>
            </div>
            {
                loading 
                && <Spinner animation="border"></Spinner> 
                || <div style={{flex: 1, padding: '12px'}}>
                    {children}
                </div>
            }
    </Stack>
}
