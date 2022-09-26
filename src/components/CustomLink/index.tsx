import {Link, LinkProps, NavLink, NavLinkProps} from 'react-router-dom';

export const CustomLink = (props: LinkProps) => {
    return (
        <Link {...props} style={{
            ...props.style,
            color: 'inherit',
            textDecoration: 'inherit',
            cursor:'pointer'
        }}>
            {props.children}
        </Link>
    )
}
export const CustomNavLink = (props: NavLinkProps) => {
    return (
        <NavLink {...props} style={{
            ...props.style,
            color: 'inherit',
            textDecoration: 'inherit',
            cursor:'pointer'
        }}>
            {props.children}
        </NavLink>
    )
}