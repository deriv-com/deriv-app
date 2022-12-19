import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import { findRouteByPath, normalizePath } from './helpers';
import { TPlatformContext } from 'Types';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TBinaryLink = {
    active_class: string;
    is_pre_appstore: boolean;
    to: string;
};

const BinaryLink = ({
    active_class,
    to,
    children,
    is_pre_appstore,
    ...props
}: React.PropsWithChildren<Partial<TBinaryLink>>) => {
    const { is_appstore } = React.useContext<TPlatformContext>(PlatformContext);
    const path = normalizePath(to as string);
    const route = findRouteByPath(path, getRoutesConfig({ is_appstore, is_pre_appstore }));

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

export default connect(({ client }: RootStore) => ({
    is_pre_appstore: client.is_pre_appstore,
}))(BinaryLink);
