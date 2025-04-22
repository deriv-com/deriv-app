import React from 'react';

import { Loading } from '@deriv/components';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { ACCOUNTS_OS_POI_STATUS_URL, ACCOUNTS_OS_POI_URL, getSocketURL } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { LocalStorageUtils, URLUtils, WebSocketUtils } from '@deriv-com/utils';

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
    const localize_language = LocalStorageUtils.getValue<string>('i18n_language');
    const url_lang = URLUtils.getQueryParameter('lang');
    const i18n_language = localize_language || url_lang || 'en';

    const getFormattedURL = (url_link: string) => {
        const url = new URL(url_link);
        const urlParams = new URLSearchParams(location.search);
        const platform = urlParams.get('platform') ?? (is_from_tradershub_os ? 'tradershub_os' : 'deriv_app');

        const params = {
            platform,
            appid: String(WebSocketUtils.getAppId()),
            lang: i18n_language,
            server: getSocketURL(),
            token: getToken(),
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return url.toString();
    };

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
