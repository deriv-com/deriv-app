import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { isEmptyObject, routes, removeBranchName, default_title } from '@deriv/shared';
import type { TBinaryRoutes, TRoute } from 'Types';

type TRouteWithSubRoutes = TRoute & TBinaryRoutes;

const RouteWithSubRoutes = (route: TRouteWithSubRoutes) => {
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
        } else {
            const default_subroute = route.routes ? route.routes.find(r => r.default) : { path: '' };
            const has_default_subroute = !isEmptyObject(default_subroute);
            const pathname = removeBranchName(location.pathname);

            const RouteComponent = route.component as React.ElementType;

            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute?.path} />}
                    <RouteComponent {...props} routes={route.routes} />
                </React.Fragment>
            );
        }

        const title = route.getTitle?.() || '';
        document.title = `${title} | ${default_title}`;
        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export default RouteWithSubRoutes;
