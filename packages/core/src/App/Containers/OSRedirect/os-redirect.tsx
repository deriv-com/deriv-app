import { Loader } from '@deriv-com/ui';
import { getDomainName, routes } from '@deriv/shared';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const OSRedirect = () => {
    const url_query_string = window.location.search;
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

    const route_mappings = [
        { pattern: /accumulator/i, route: routes.trade, type: 'accumulator' },
        { pattern: /turbos/i, route: routes.trade, type: 'turboslong' },
        { pattern: /vanilla/i, route: routes.trade, type: 'vanillalongcall' },
        { pattern: /multiplier/i, route: routes.trade, type: 'multiplier' },
        { pattern: /proof-of-address/i, route: routes.proof_of_address, platform: 'tradershub_os' },
        { pattern: /proof-of-identity/i, route: routes.proof_of_identity, platform: 'tradershub_os' },
        { pattern: /personal-details/i, route: routes.personal_details, platform: 'tradershub_os' },
        { pattern: /dbot/i, route: routes.bot },
    ];

    const matched_route = route_mappings.find(({ pattern }) => pattern.test(url_query_string));

    let updated_search = url_query_string;
    if (matched_route && matched_route.type) {
        updated_search = `${url_query_string}&trade_type=${matched_route.type}`;
    }
    if (matched_route && matched_route.platform) {
        updated_search = `${url_query_string}&platform=${matched_route.platform}`;
    }

    history.push({
        pathname: matched_route?.route,
        // @ts-expect-error need to update react-router-dom types
        search: updated_search,
    });

    return <Loader isFullScreen />;
};

export default OSRedirect;
