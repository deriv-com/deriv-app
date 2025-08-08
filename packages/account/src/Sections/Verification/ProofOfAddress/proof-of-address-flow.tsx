import React from 'react';

import { Loading } from '@deriv/components';
import { ACCOUNTS_OS_POA_URL, getSocketURL } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { LocalStorageUtils, URLUtils, WebSocketUtils } from '@deriv-com/utils';

const ProofOfAddressFlow = observer(() => {
    const {
        client: { getToken },
        common: { is_from_tradershub_os },
    } = useStore();

    const localize_language = LocalStorageUtils.getValue<string>('i18n_language');
    const url_lang = URLUtils.getQueryParameter('lang');
    const i18n_language = localize_language || url_lang || 'en';

    const getFormattedURL = (url_link: string) => {
        const url = new URL(url_link);
        const urlParams = new URLSearchParams(location.search);
        const platformConfig = urlParams.get('platform') ?? window.sessionStorage.getItem('config.platform');
        const platform = platformConfig ?? (is_from_tradershub_os ? 'tradershub_os' : 'deriv_app');

        const params = {
            platform,
            appid: WebSocketUtils.getAppId(),
            lang: i18n_language,
            server: getSocketURL(),
            token: getToken(),
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return url.toString();
    };

    window.location.replace(getFormattedURL(ACCOUNTS_OS_POA_URL));

    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default ProofOfAddressFlow;
