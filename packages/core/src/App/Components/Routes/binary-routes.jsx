import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = ({ pushDataLayer, promptFn, prompt_when, ...props }) => {
    const location = useLocation();

    React.useEffect(() => {
        pushDataLayer({ event: 'page_load' });
    }, [pushDataLayer, location]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Prompt when={prompt_when} message={promptFn} />
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default connect(({ ui, gtm }) => ({
    prompt_when: ui.prompt_when,
    promptFn: ui.promptFn,
    pushDataLayer: gtm.pushDataLayer,
}))(BinaryRoutes);
