import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import { getDomainName, routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Loader } from '@deriv-com/ui';

const OSRedirect = () => {
    const {
        client: { is_logged_in },
    } = useStore();
    const history = useHistory();

    // TODO: remove this after oauth2 migration
    // get data from cookies and populate local storage for clients
    // to be logged in coming from OS subdomains
    const client_accounts = Cookies.get('client.accounts');
    const active_loginid = Cookies.get('active_loginid');

    if (client_accounts && active_loginid) {
        localStorage.setItem('client.accounts', client_accounts);
        localStorage.setItem('active_loginid', active_loginid);

        const domain = getDomainName();

        // remove cookies after populating local storage
        Cookies.remove('client.accounts', { domain, secure: true });
        Cookies.remove('active_loginid', { domain, secure: true });

        window.location.reload();
    }

    useEffect(() => {
        const url_query_string = window.location.search;
        const dtrader_routes = [
            { pattern: /accumulator/i, route: routes.trade, type: 'accumulator' },
            { pattern: /turbos/i, route: routes.trade, type: 'turboslong' },
            { pattern: /vanilla/i, route: routes.trade, type: 'vanillalongcall' },
            { pattern: /multiplier/i, route: routes.trade, type: 'multiplier' },
        ];

        const params = new URLSearchParams(url_query_string);
        params.delete('redirect_to');

        const dtrader_route = dtrader_routes.find(({ pattern }) => pattern.test(url_query_string));

        /**
         * Redirect to dtrader route
         * Logging in will be handled by dtrader app
         */
        if (dtrader_route) {
            return history.push({
                pathname: dtrader_route?.route,
                // @ts-expect-error need to update react-router-dom types
                search: params.toString(),
            });
        }

        const accounts_routes = [
            { pattern: /proof-of-address/i, route: routes.proof_of_address },
            { pattern: /proof-of-identity/i, route: routes.proof_of_identity },
            { pattern: /personal-details/i, route: routes.personal_details },
        ];
        const accounts_route = accounts_routes.find(({ pattern }) => pattern.test(url_query_string));
        /**
         * Redirect to accounts route if user is logged in
         * Need to wait logged in state to be updated before redirecting
         */
        if (is_logged_in && !dtrader_route && accounts_route) {
            return history.push({
                pathname: accounts_route?.route,
                // @ts-expect-error need to update react-router-dom types
                search: params.toString(),
            });
        }
    }, [history, is_logged_in]);

    return <Loader isFullScreen />;
};

export default OSRedirect;
