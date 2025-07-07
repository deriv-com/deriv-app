/* eslint-disable no-console */
import React from 'react';
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

    if (has_wallet) {
        const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

        console.log('hub redirection 1', isHubRedirectionEnabled);
        const url_query_string = window.location.search;
        const url_params = new URLSearchParams(url_query_string);
        const account_currency = window.sessionStorage.getItem('account') || url_params.get('account');
        console.log('hub redirection 2', isHubRedirectionEnabled);
        window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
        console.log('hub redirection 3', isHubRedirectionEnabled);
    }

    console.log('has_wallet', has_wallet);
    console.log('hub redirection 4', isHubRedirectionEnabled);
    console.log('hub redirection loaded', isHubRedirectionLoaded);

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
