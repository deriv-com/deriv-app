import React from 'react';

import { Loading } from '@deriv/components';
import { ACCOUNTS_OS_POI_STATUS_URL, ACCOUNTS_OS_POI_URL, getAppId, getSocketURL } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { useKycAuthStatus } from '../hooks';

const RedirectToOSPOI = observer(() => {
    const {
        client: { getToken, residence },
    } = useStore();
    const getFormattedURL = (url_link: string) => {
        const url = new URL(url_link);
        const token = getToken();
        const appID = getAppId();
        const server = getSocketURL();
        url.searchParams.append('platform', 'deriv_app');
        url.searchParams.append('appid', appID);
        url.searchParams.append('lang', 'en');
        url.searchParams.append('server', server);
        url.searchParams.append('token', token);
        return url.toString();
    };

    const { kyc_auth_status } = useKycAuthStatus({ country: residence });
    React.useEffect(() => {
        if (kyc_auth_status) {
            const { identity } = kyc_auth_status;
            if (identity.status === 'none') {
                window.location.href = getFormattedURL(ACCOUNTS_OS_POI_URL);
            } else {
                window.location.href = getFormattedURL(ACCOUNTS_OS_POI_STATUS_URL);
            }
        }
    }, [kyc_auth_status, getFormattedURL]);

    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default RedirectToOSPOI;
