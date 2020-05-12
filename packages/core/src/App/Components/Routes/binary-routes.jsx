import React from 'react';
import { Switch, Prompt } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { routes } from 'Constants';

const BinaryRoutes = props => (
    <React.Suspense fallback={<Loading />}>
        <Prompt when={props.prompt_when} message={props.prompt_fn} />
        <Switch>
            {getRoutesConfig().map((route, idx) => (
                <RouteWithSubRoutes key={idx} {...route} {...props} />
            ))}
        </Switch>
    </React.Suspense>
);

export default connect(({ ui }) => ({
    prompt_when: ui.prompt_when,
    prompt_fn: ui.prompt_fn,
}))(BinaryRoutes);
