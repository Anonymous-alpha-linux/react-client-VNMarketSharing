import React from 'react';
import {Home} from '../../containers';

export * from './page - account';
export * from './page - postProduct';
export * from './page - singleProduct';
export * from './page - product';
export * from './page - productTable';
export * from './page - productFilter';
export * from './page - checkout';
export * from './page - cart';
export * from './page - order';
export * from './page - orderTracker';
export * from './page - dashboard';
export * from './page - profile';
export * from './page - notification';

export const UserMain: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Home.Hero></Home.Hero>
            <Home.Service></Home.Service>
            <Home.Contact></Home.Contact>
        </React.Fragment>
    )
}