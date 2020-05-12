import React from 'react';
import { Switch } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = props => (
    <React.Suspense fallback={<Loading />}>
        <Switch>
            {getRoutesConfig().map((route, idx) => (
                <RouteWithSubRoutes
                    key={idx}
                    {...route}
                    {...props}
                    {...(route.title === 'Bot' && { prompt_before_leave: props.is_bot_running })}
                />
            ))}
        </Switch>
    </React.Suspense>
);

export default connect(({ ui }) => ({
    is_bot_running: ui.is_bot_running,
}))(BinaryRoutes);
