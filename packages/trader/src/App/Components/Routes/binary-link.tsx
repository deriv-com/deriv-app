import React from 'react';
import { NavLink } from 'react-router-dom';
import { findRouteByPath, normalizePath } from './helpers';
import getRoutesConfig from '../../Constants/routes-config';

type TBinaryLinkProps = Omit<React.HTMLProps<HTMLAnchorElement>, 'title' | 'ref'> &
    React.PropsWithChildren<{
        active_class?: string;
        className?: string;
        to?: string;
        onClick?: () => void;
    }>;

// TODO: solve circular dependency problem
// when binary link is imported into components present in routes config
// or into their descendants
const BinaryLink = React.forwardRef<HTMLAnchorElement, TBinaryLinkProps>(
    ({ active_class = '', to, children, ...props }, ref) => {
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
                ref={ref}
                {...props}
            >
                {children}
            </NavLink>
        ) : (
            <a data-testid='dt_binary_link' ref={ref} {...props}>
                {children}
            </a>
        );
    }
);

BinaryLink.displayName = 'BinaryLink';

export default BinaryLink;
