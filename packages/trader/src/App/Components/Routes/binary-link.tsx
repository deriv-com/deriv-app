import React from 'react';
import { NavLink } from 'react-router-dom';
import { findRouteByPath, normalizePath } from './helpers';
import getRoutesConfig from '../../Constants/routes-config';

type TBinaryLinkProps = React.PropsWithChildren<{
    active_class?: string;
    className?: string;
    to?: string;
    onClick?: () => void;
}>;

// TODO: solve circular dependency problem
// when binary link is imported into components present in routes config
// or into their descendants
const BinaryLink = ({ active_class = '', to, children, ...props }: TBinaryLinkProps) => {
    const path = normalizePath(to);
    const route = findRouteByPath(path, getRoutesConfig());

    if (!route) {
        throw new Error(`Route not found: ${to}`);
    }

    return to ? (
        <NavLink
            data-testid='dt_binary_link'
            to={path}
            activeClassName={active_class || 'active'}
            exact={route.exact}
            {...props}
        >
            {children}
        </NavLink>
    ) : (
        <a data-testid='dt_binary_link' {...props}>
            {children}
        </a>
    );
};

export default BinaryLink;
