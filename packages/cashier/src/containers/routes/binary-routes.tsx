import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Loading } from '@deriv/components';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';
import { deriv_urls } from '@deriv/shared';
import { useStore } from '@deriv/stores';

import Page404 from 'Components/page-404';
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

    if (has_wallet && isHubRedirectionEnabled && isHubRedirectionLoaded) {
        const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

        const domain = /deriv\.(com|me|be)/.test(window.location.hostname)
            ? deriv_urls.DERIV_HOST_NAME
            : window.location.hostname;
        Cookies.set('wallet_account', true, { domain });

        const url_query_string = window.location.search;
        const url_params = new URLSearchParams(url_query_string);
        const account_currency = window.sessionStorage.getItem('account') || url_params.get('account');
        window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
    }

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
