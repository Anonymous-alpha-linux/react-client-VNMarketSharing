import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {useTypedSelector,useActions} from '../hooks';

export function Auth() {
    const {data, loading, error} = useTypedSelector(state=>state.auth);

    return (
        data.isAuthorized ?<Navigate to={'/'} replace={true}></Navigate> :<Outlet></Outlet>
    )
}
