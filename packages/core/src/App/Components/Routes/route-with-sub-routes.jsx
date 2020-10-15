import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    redirectToLogin,
    redirectToSignUp,
    removeBranchName,
    routes,
    isEmptyObject,
    default_title,
    PlatformContext,
} from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import LoginPrompt from 'App/Components/Elements/login-prompt.jsx';
import { connect } from 'Stores/connect';

const RouteWithSubRoutes = route => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    const renderFactory = props => {
        let result = null;
        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (route.is_authenticated && !route.is_logged_in) {
            result = (
                <LoginPrompt
                    onLogin={() => redirectToLogin(route.is_logged_in, getLanguage())}
                    onSignup={() => redirectToSignUp({ is_deriv_crypto })}
                    page_title={route.getTitle()}
                />
            );
        } else {
            const default_subroute = route.routes ? route.routes.find(r => r.default) : {};
            const has_default_subroute = !isEmptyObject(default_subroute);
            const pathname = removeBranchName(location.pathname);
            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute.path} />}
                    <route.component {...props} routes={route.routes} passthrough={route.passthrough} />
                </React.Fragment>
            );
        }

        const title = route.getTitle?.() || '';
        document.title = `${title} | ${default_title}`;
        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export { RouteWithSubRoutes as RouteWithSubRoutesRender }; // For tests

export default connect(({ gtm }) => ({
    pushDataLayer: gtm.pushDataLayer,
}))(RouteWithSubRoutes);
