import React from 'react';
import { NavLink } from 'react-router-dom';
import getRoutesConfig from 'Constants/routes-config';
import { findRouteByPath, normalizePath } from './helpers';

type TBinaryLink = {
    active_class: string;
    to: string;
};

const BinaryLink = ({ active_class, to, children, ...props }: React.PropsWithChildren<Partial<TBinaryLink>>) => {
    const path = normalizePath(to!);
    const route = findRouteByPath(path, getRoutesConfig());

    if (!route) {
        throw new Error(`Route not found: ${to}`);
    }

    return to ? (
        <NavLink to={path} activeClassName={active_class || 'active'} exact={route.exact} {...props}>
            {children}
        </NavLink>
    ) : (
        <a {...props}>{children}</a>
    );
};

export default BinaryLink;
