import React from 'react';
import Cookies from 'js-cookie';
import { deriv_urls } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import useP2PSettings from './useP2PSettings';

const useIsP2PEnabled = () => {
    const {
        p2p_settings,
        rest: { isLoading, isSubscribed },
    } = useP2PSettings();
    const { client, traders_hub } = useStore();
    // Todo: to replace it with useAuthorize hook
    const { currency, email, is_virtual, loginid, setIsP2PEnabled } = client;
    const { is_low_risk_cr_eu_real } = traders_hub;

    const is_p2p_supported_currency = Boolean(
        p2p_settings?.supported_currencies?.includes(currency.toLocaleLowerCase())
    );
    const is_p2p_enabled = is_p2p_supported_currency && !is_virtual && !is_low_risk_cr_eu_real;

    // Todo: should replace with the next line instead once BE is fixed.
    // const is_p2p_enabled = data?.disabled === 0;

    React.useEffect(() => {
        setIsP2PEnabled(is_p2p_enabled);

        if (email && loginid) {
            const domain = /deriv\.(com|me|be)/.test(window.location.hostname)
                ? deriv_urls.DERIV_HOST_NAME
                : window.location.hostname;

            Cookies.set('is_p2p_disabled', (!is_p2p_enabled).toString(), { domain, secure: true, sameSite: 'none' });
        }
    }, [email, is_p2p_enabled, loginid, setIsP2PEnabled]);

    return {
        is_p2p_enabled,
        is_p2p_enabled_loading: isLoading,
        is_p2p_enabled_success: isSubscribed,
    };
};

export default useIsP2PEnabled;
