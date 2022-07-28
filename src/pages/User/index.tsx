import React from 'react';
import {Home} from '../../containers';

export const UserMain: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Home.Hero></Home.Hero>
            <Home.Service></Home.Service>
            <Home.Contact></Home.Contact>
        </React.Fragment>
    )
}