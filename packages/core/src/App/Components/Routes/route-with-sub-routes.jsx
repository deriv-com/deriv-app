import React               from 'react';
import {
    Redirect,
    Route }                from 'react-router-dom';
import {
    redirectToLogin,
    redirectToSignUp }     from '_common/base/login';
import BinarySocket        from '_common/base/socket_base';
import LoginPrompt         from 'App/Components/Elements/login-prompt.jsx';
import { default_title }   from 'App/Constants/app-config';
import routes              from 'Constants/routes';
import { connect }         from 'Stores/connect';

const RouteWithSubRoutes = route => {
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
        } else {
            result = (
                (route.is_authenticated && !route.is_logged_in) ?
                    <LoginPrompt
                        onLogin={redirectToLogin}
                        onSignup={redirectToSignUp}
                        page_title={route.title}
                    />
                    :
                    <route.component {...props} routes={route.routes} passthrough={route.passthrough} />
            );
        }

        const title = route.title ? `${route.title} | ` : '';
        document.title = `${ title }${ default_title }`;
        BinarySocket.wait('website_status').then(() => {
            route.pushDataLayer({ event: 'page_load' });
        });
        return result;
    };

    return <Route
        exact={route.exact}
        path={route.path}
        render={renderFactory}
    />;
};

export { RouteWithSubRoutes as RouteWithSubRoutesRender }; // For tests

export default connect(({ gtm }) => ({
    pushDataLayer: gtm.pushDataLayer,
}))(RouteWithSubRoutes);
