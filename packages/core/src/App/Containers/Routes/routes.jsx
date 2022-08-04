import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { urlForLanguage } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import BinaryRoutes from 'App/Components/Routes';
import { connect } from 'Stores/connect';

const Error = Loadable({
    loader: () => import(/* webpackChunkName: "error-component" */ 'App/Components/Elements/Errors'),
    loading: UILoader,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const Routes = ({
    addRouteHistoryItem,
    error,
    has_error,
    history,
    is_logged_in,
    is_logging_in,
    location,
    passthrough,
    setAppRouterHistory,
    setInitialRouteHistoryItem,
}) => {
    const initial_route = React.useRef(null);
    const unlisten_to_change = React.useRef(null);

    React.useEffect(() => {
        if (!unlisten_to_change.current && !initial_route.current) {
            initial_route.current = location.pathname;
        }

        setInitialRouteHistoryItem(history.location);

        unlisten_to_change.current = history.listen((route_to, action) => {
            if (['PUSH', 'POP'].includes(action)) addRouteHistoryItem({ ...route_to, action });
        });

        setAppRouterHistory(history);

        return () => {
            if (typeof unlisten_to_change.current === 'function') {
                unlisten_to_change.current();
                unlisten_to_change.current = null;
                initial_route.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const lang = getLanguage();
    const lang_regex = /[?&]lang=/;
    const has_lang = lang_regex.test(location.search);

    if (has_error) {
        return <Error {...error} />;
    }

    // we need to replace state of history object on every route
    // to prevent language query parameter from disappering
    // for non-english languages. Upon visiting with a
    // non-supported language, the language still
    // shows up in the URL. This is not in sync
    // with the default language (EN), so we
    // will remove it.
    if ((!has_lang && lang !== 'EN') || (has_lang && lang === 'EN')) {
        window.history.replaceState({}, document.title, urlForLanguage(lang));
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
};

Routes.propTypes = {
    addRouteHistoryItem: PropTypes.func,
    error: MobxPropTypes.objectOrObservableObject,
    has_error: PropTypes.bool,
    history: PropTypes.object,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_virtual: PropTypes.bool,
    location: PropTypes.object,
    passthrough: PropTypes.object,
    setAppRouterHistory: PropTypes.func,
    setInitialRouteHistoryItem: PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common }) => ({
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        error: common.error,
        has_error: common.has_error,
        setAppRouterHistory: common.setAppRouterHistory,
        addRouteHistoryItem: common.addRouteHistoryItem,
        setInitialRouteHistoryItem: common.setInitialRouteHistoryItem,
    }))(Routes)
);
