import React from 'react';
import { Switch } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { connect } from 'Stores/connect';
import { TPlatformContext } from 'Types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BinaryRoutes = (props: { [key: string]: any }) => {
    const { is_appstore } = React.useContext<TPlatformContext>(PlatformContext);
    // eslint-disable-next-line react/prop-types
    const { is_social_signup } = props;

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig({ is_appstore }, is_social_signup).map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

// TODO: Will add type for store when https://github.com/binary-com/deriv-app/pull/6447 is merged
export default connect(({ client }) => ({
    is_social_signup: client.is_social_signup,
}))(BinaryRoutes);
