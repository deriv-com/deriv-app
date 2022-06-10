/* eslint-disable react/prop-types */
import React from 'react';
import { Redirect, RedirectProps, Route } from 'react-router-dom';
import {
    alternateLinkTagChange,
    canonicalLinkTagChange,
    redirectToLogin,
    isEmptyObject,
    routes,
    removeBranchName,
    default_title,
} from '@deriv/shared';
import { RouteComponentProps } from 'react-router';
import { getLanguage } from '@deriv/translations';
import { TRouteConfig, TRoute } from '../../Constants/routes-config';

// extract TBinaryRoutesProps from BinaryRoutes to share types
type TRouteWithSubRoutesProps = TRouteConfig & {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

type TDefaultSubroute = TRoute | Record<string, never> | undefined;

const RouteWithSubRoutes = (route: TRouteWithSubRoutesProps) => {
    const renderFactory = (props: RouteComponentProps) => {
        let result = null;
        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (route.is_authenticated && !route.is_logging_in && !route.is_logged_in) {
            redirectToLogin(route.is_logged_in, getLanguage());
        } else {
            const default_subroute: TDefaultSubroute = route.routes ? route.routes.find(r => r.default) : {};
            const has_default_subroute = !isEmptyObject(default_subroute);
            const pathname = removeBranchName(location.pathname);
            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute?.path} />}
                    <route.component
                        {...props}
                        // routes={route.routes}
                    />
                </React.Fragment>
            );
        }

        const title = route.getTitle?.() || '';
        document.title = `${title} | ${default_title}`;

        alternateLinkTagChange();
        canonicalLinkTagChange();

        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export { RouteWithSubRoutes as RouteWithSubRoutesRender }; // For tests

export default RouteWithSubRoutes;
