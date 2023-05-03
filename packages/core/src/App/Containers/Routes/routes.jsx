import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { urlSetQuery } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import BinaryRoutes from 'App/Components/Routes';
import { observer, useStore } from '@deriv/stores';

const Error = Loadable({
    loader: () => import(/* webpackChunkName: "error-component" */ 'App/Components/Elements/Errors'),
    loading: UILoader,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const Routes = observer(({ history, location, passthrough }) => {
    const { client, common, ui } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error, setAppRouterHistory, addRouteHistoryItem, setInitialRouteHistoryItem } = common;
    const { is_dark_mode_on } = ui;
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

    if (has_error) {
        return <Error {...error} />;
    }

    // we need to replace state of history object on every route
    // to prevent language query parameter from disappering
    // for non-english languages. Upon visiting with a
    // non-supported language, the language still
    // shows up in the URL. This is not in sync
    // with the default language (EN), so we
    // will remove it. (The same thing for dark_mode)
    window.history.replaceState(
        {},
        document.title,
        urlSetQuery({ lang: lang.replace('EN', ''), dark: Number(is_dark_mode_on) })
    );

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
});

Routes.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    passthrough: PropTypes.object,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
