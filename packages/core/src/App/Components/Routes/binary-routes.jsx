import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = props => {
    const location = useLocation();
    const { is_pre_appstore } = props;
    const { is_appstore } = React.useContext(PlatformContext);
    React.useEffect(() => {
        props.pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const is_eu_country = props.isEuropeCountry;

    return (
        <React.Suspense fallback={<Loading />}>
            <Prompt when={props.prompt_when} message={props.promptFn} />
            <Switch>
                {getRoutesConfig({ is_appstore, is_pre_appstore, is_eu_country }).map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default connect(({ ui, gtm, client }) => ({
    prompt_when: ui.prompt_when,
    promptFn: ui.promptFn,
    pushDataLayer: gtm.pushDataLayer,
    isEuropeCountry: client.isEuropeCountry,
    is_pre_appstore: client.is_pre_appstore,
}))(BinaryRoutes);
