import React from 'react';
import {Home} from '../../containers';

export * from './account';
export * from './postProduct';
export * from './product';
export * from './singleProduct';
export * from './userPage';
export * from './productTable';
export * from './productFilter';
export * from './checkout';
export * from './cart';
export * from './order';

export const UserMain: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Home.Hero></Home.Hero>
            <Home.Service></Home.Service>
            <Home.Contact></Home.Contact>
        </React.Fragment>
    )
}