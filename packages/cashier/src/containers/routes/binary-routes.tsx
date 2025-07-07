import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';

import { Loading } from '@deriv/components';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';
import { useStore } from '@deriv/stores';

import getRoutesConfig from 'Constants/routes-config';

import RouteWithSubRoutes from './route-with-sub-routes';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    const { client } = useStore();
    const { isHubRedirectionEnabled, isHubRedirectionLoaded } = useIsHubRedirectionEnabled();
    const { has_wallet } = client;
    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub';
    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub';

    useEffect(() => {
        if (isHubRedirectionEnabled && isHubRedirectionLoaded && has_wallet) {
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);

            const client_accounts = JSON.parse(window.localStorage.getItem('client_accounts') || '{}');
            const active_wallet_loginid = window.sessionStorage.getItem('active_wallet_loginid');
            const account_currency =
                client_accounts?.[active_wallet_loginid || '']?.currency || url_params.get('account');

            window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
        }
    }, [isHubRedirectionEnabled, isHubRedirectionLoaded, has_wallet]);

    if (has_wallet) return <Loading is_fullscreen />;

    return (
        <React.Suspense fallback={<Loading className='cashier__loader' is_fullscreen={false} />}>
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
