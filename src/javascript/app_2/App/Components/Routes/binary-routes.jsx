import React              from 'react';
import { Switch }         from 'react-router-dom';
import getRoutesConfig    from 'App/Constants/routes-config';
import UILoader           from 'App/Components/Elements/ui-loader.jsx';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = (props) => (
    <React.Suspense fallback={<UILoader />}>
        <Switch>
            {
                getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))
            }
        </Switch>
    </React.Suspense>

);

export default BinaryRoutes;
