import React from 'react';
import { Switch, Prompt } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = props => (
    <React.Suspense fallback={<Loading />}>
        <Prompt when={props.prompt_when} message={props.promptFn} />
        <Switch>
            {getRoutesConfig().map((route, idx) => (
                <RouteWithSubRoutes key={idx} {...route} {...props} />
            ))}
        </Switch>
    </React.Suspense>
);

export default connect(({ ui }) => ({
    prompt_when: ui.prompt_when,
    promptFn: ui.promptFn,
}))(BinaryRoutes);
