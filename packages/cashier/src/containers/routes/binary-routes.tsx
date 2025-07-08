import React, { useMemo } from 'react';
import { Switch } from 'react-router-dom';

import { useRemoteConfig } from '@deriv/api';
import { Loading } from '@deriv/components';
import { useStore } from '@deriv/stores';

import getRoutesConfig from 'Constants/routes-config';

import RouteWithSubRoutes from './route-with-sub-routes';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    const { client } = useStore();
    const { data: remoteConfigData } = useRemoteConfig(true);
    const { account_settings, has_wallet } = client;

    const hub_enabled_country_list = useMemo(
        () => (remoteConfigData?.hub_enabled_country_list as string[]) ?? [],
        [remoteConfigData]
    );
    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub';
    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub';

    const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);

    const client_accounts = JSON.parse(window.localStorage.getItem('client_accounts') || '{}');
    const active_wallet_loginid = window.sessionStorage.getItem('active_wallet_loginid');
    const account_currency = client_accounts?.[active_wallet_loginid || '']?.currency || url_params.get('account');

    if (has_wallet && hub_enabled_country_list.length === 0) return <Loading is_fullscreen />;

    if (
        has_wallet &&
        hub_enabled_country_list.length > 0 &&
        account_settings.country_code &&
        hub_enabled_country_list.includes(account_settings.country_code)
    ) {
        window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet_home${account_currency ? `&account=${account_currency}` : ''}`;
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
