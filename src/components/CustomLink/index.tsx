import React from 'react'
import {Link, LinkProps} from 'react-router-dom';

export const CustomLink = (props: LinkProps) => {
    return (
        <Link {...props} style={{
            ...props.style,
            color: 'inherit',
            textDecoration: 'inherit'
        }}>
        </Link>
    )
}