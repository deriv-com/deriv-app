import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize, PlatformContext } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { connect } from 'Stores/connect';

const BinaryRoutes = props => {
    const { is_appstore } = React.useContext(PlatformContext);
    const { is_social_signup } = props;
    return (
        <React.Suspense
            fallback={() => {
                return (
                    <div>
                        <Localize i18n_default_text='Loading...' />
                    </div>
                );
            }}
        >
            <Switch>
                {getRoutesConfig({ is_appstore }, is_social_signup).map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default connect(({ client }) => ({
    is_social_signup: client.is_social_signup,
}))(BinaryRoutes);
