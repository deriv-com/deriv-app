import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import { findRouteByPath, normalizePath } from './helpers';
import { connect } from 'Stores/connect';

const BinaryLink = ({ active_class, to, children, is_social_signup, ...props }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const path = normalizePath(to);
    const route = findRouteByPath(path, getRoutesConfig({ is_appstore }, is_social_signup));

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

BinaryLink.propTypes = {
    active_class: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    is_social_signup: PropTypes.bool,
    to: PropTypes.string,
};

export default connect(({ client }) => ({
    is_social_signup: client.is_social_signup,
}))(BinaryLink);
