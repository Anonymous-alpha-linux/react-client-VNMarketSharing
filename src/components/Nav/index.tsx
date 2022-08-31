import './nav.css';
import React from 'react'

interface NavProps{
    
}
export const Nav: React.FC<NavProps> = ({}) => {
    return (
        <div className="navbar__root">
            <span className="navbar__logo">
                <img src='' alt="AdsmarketingSharing"></img>
            </span>
            
            <span></span>
        </div>
    )
}