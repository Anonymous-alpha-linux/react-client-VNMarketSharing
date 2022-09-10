import React from 'react';
import {Spinner, Stack} from 'react-bootstrap';
import {Account} from '../../containers';
import { useTypedSelector } from '../../hooks';

export const AccountPage = ({children}: {children:React.ReactNode}) => {
    const {loading} = useTypedSelector(state=> state.user);

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
