import React from 'react';
import {Home} from '../../containers';

export * from './account';
export * from './postProduct';
export * from './product';
export * from './singleItem';
export * from './userPage';
export * from './productTable';

export const UserMain: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Home.Hero></Home.Hero>
            <Home.Service></Home.Service>
            <Home.Contact></Home.Contact>
        </React.Fragment>
    )
}