import { useStore } from '@deriv/stores';
import useP2PSettings from './useP2PSettings';

const useIsP2PEnabled = () => {
    const {
        p2p_settings,
        rest: { isLoading, isSubscribed },
    } = useP2PSettings();
    const { client, traders_hub } = useStore();
    // Todo: to replace it with useAuthorize hook
    const { currency, is_virtual } = client;
    const { is_low_risk_cr_eu_real } = traders_hub;

    const is_p2p_supported_currency = Boolean(
        p2p_settings?.supported_currencies?.includes(currency.toLocaleLowerCase())
    );
    const is_p2p_enabled = is_p2p_supported_currency && !is_virtual && !is_low_risk_cr_eu_real;

    // Todo: should replace with the next line instead once BE is fixed.
    // const is_p2p_enabled = data?.disabled === 0;

    return {
        is_p2p_enabled,
        is_p2p_enabled_loading: isLoading,
        is_p2p_enabled_success: isSubscribed,
    };
};

export default useIsP2PEnabled;
