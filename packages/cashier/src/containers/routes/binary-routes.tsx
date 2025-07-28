import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';

import { Loading } from '@deriv/components';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';
import { deriv_urls, getDomainUrl } from '@deriv/shared';
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
    const {
        has_wallet,
        is_logged_in,
        is_logging_out,
        prevent_redirect_to_hub,
        is_client_store_initialized,
        prevent_single_login,
        setPreventSingleLogin,
    } = client;

    const PRODUCTION_REDIRECT_URL = `https://hub.${getDomainUrl()}/tradershub`;
    const STAGING_REDIRECT_URL = `https://staging-hub.${getDomainUrl()}/tradershub`;

    useEffect(() => {
        if (
            isHubRedirectionEnabled &&
            has_wallet &&
            !is_logging_out &&
            is_logged_in &&
            !prevent_redirect_to_hub &&
            is_client_store_initialized
        ) {
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

            const domain = /deriv\.(com|me|be)/.test(window.location.hostname)
                ? deriv_urls.DERIV_HOST_NAME
                : window.location.hostname;
            Cookies.set('wallet_account', true, { domain });

            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            const account_currency = window.sessionStorage.getItem('account') || url_params.get('account');
            localStorage.setItem('wallet_redirect_done', true);
            const redirect_path = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
            window.location.href = redirect_path;
        }

        const shouldStayInDerivApp = !isHubRedirectionEnabled || !has_wallet || prevent_redirect_to_hub;
        if (prevent_single_login && isHubRedirectionLoaded && is_client_store_initialized && shouldStayInDerivApp) {
            setPreventSingleLogin(false);
        }
    }, [
        isHubRedirectionLoaded,
        isHubRedirectionEnabled,
        has_wallet,
        is_logging_out,
        is_logged_in,
        prevent_redirect_to_hub,
        prevent_single_login,
        is_client_store_initialized,
    ]);
    if (has_wallet && isHubRedirectionLoaded && isHubRedirectionEnabled) {
        return <Loading is_fullscreen />;
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
