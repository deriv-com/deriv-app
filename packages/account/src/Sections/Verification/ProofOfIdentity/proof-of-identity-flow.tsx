import React from 'react';

import { Loading } from '@deriv/components';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { ACCOUNTS_OS_POI_STATUS_URL, ACCOUNTS_OS_POI_URL, getAppId, getSocketURL } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { useKycAuthStatus } from '../../../hooks';

import ProofOfIdentity from './proof-of-identity';

const ProofOfIdentityFlow = observer(() => {
    const {
        client: { getToken, residence },
        common: { is_from_tradershub_os },
    } = useStore();
    const { kyc_auth_status, isLoading: isKYCLoading } = useKycAuthStatus({ country: residence });
    const [shouldRedirectToAccountsOSApp, isRedirectToAccountsOSAppFFLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'redirect_to_poi_in_accounts_os',
    });

    const getFormattedURL = url_link => {
        const url = new URL(url_link);
        const urlParams = new URLSearchParams(location.search);
        const platformConfig = urlParams.get('platform') ?? window.sessionStorage.getItem('config.platform');
        const platform = platformConfig ?? (is_from_tradershub_os ? 'tradershub_os' : 'deriv_app');

        const params = {
            platform,
            appid: getAppId(),
            lang: 'en',
            server: getSocketURL(),
            token: getToken(),
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return url.toString();
    };

    // eslint-disable-next-line no-console
    console.log('===>', { shouldRedirectToAccountsOSApp, url: getFormattedURL(ACCOUNTS_OS_POI_URL) });

    if (isRedirectToAccountsOSAppFFLoaded && !isKYCLoading) {
        if (shouldRedirectToAccountsOSApp && kyc_auth_status) {
            const { identity } = kyc_auth_status;
            const redirect_url =
                identity.status === 'none' || identity.status === 'required'
                    ? ACCOUNTS_OS_POI_URL
                    : ACCOUNTS_OS_POI_STATUS_URL;
            window.location.replace(getFormattedURL(redirect_url));
        } else {
            return <ProofOfIdentity />;
        }
    }

    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default ProofOfIdentityFlow;
