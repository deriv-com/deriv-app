import React from 'react';

import { Loading } from '@deriv/components';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { ACCOUNTS_OS_POA_URL, getAppId, getSocketURL } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { useKycAuthStatus } from '../../../hooks';

import ProofOfAddress from './proof-of-address';

const ProofOfAddressFlow = observer(() => {
    const {
        client: { getToken, residence },
        common: { is_from_tradershub_os },
    } = useStore();
    const { kyc_auth_status } = useKycAuthStatus({ country: residence });
    const [shouldRedirectToAccountsOSApp, isRedirectToAccountsOSAppFFLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'redirect_to_poa_in_accounts_os',
    });

    const getFormattedURL = url_link => {
        const url = new URL(url_link);
        const urlParams = new URLSearchParams(location.search);
        const platform = urlParams.get('platform') ?? (is_from_tradershub_os ? 'tradershub_os' : 'deriv_app');

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

    if (isRedirectToAccountsOSAppFFLoaded) {
        if (shouldRedirectToAccountsOSApp && kyc_auth_status) {
            window.location.replace(getFormattedURL(ACCOUNTS_OS_POA_URL));
        } else {
            return <ProofOfAddress />;
        }
    }

    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default ProofOfAddressFlow;
