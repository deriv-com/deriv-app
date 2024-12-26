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
    const { kyc_auth_status } = useKycAuthStatus({ country: residence });
    const [shouldRedirectToAccountsOSApp, isRedirectToAccountsOSAppFFLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'redirect_to_poi_in_accounts_os',
    });

    const getFormattedURL = url_link => {
        const url = new URL(url_link);
        url.searchParams.append('platform', is_from_tradershub_os ? 'tradershub_os' : 'deriv_app');
        url.searchParams.append('appid', getAppId());
        url.searchParams.append('lang', 'en');
        url.searchParams.append('server', getSocketURL());
        url.searchParams.append('token', getToken());
        return url.toString();
    };

    if (isRedirectToAccountsOSAppFFLoaded) {
        if (shouldRedirectToAccountsOSApp) {
            if (kyc_auth_status) {
                const { identity } = kyc_auth_status;
                const redirect_url =
                    identity.status === 'none' || identity.status === 'required'
                        ? ACCOUNTS_OS_POI_URL
                        : ACCOUNTS_OS_POI_STATUS_URL;
                window.location.href = getFormattedURL(redirect_url);
            }
        } else {
            return <ProofOfIdentity />;
        }
    }

    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default ProofOfIdentityFlow;
