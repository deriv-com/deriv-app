import { useStore } from '@deriv/stores';
import useP2PConfig from './useP2PConfig';

const useIsP2PEnabled = () => {
    const { client, traders_hub } = useStore();
    // Todo: to replace it with useAuthorize hook
    const { currency, is_virtual } = client;
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { data, ...rest } = useP2PConfig();

    const is_p2p_supported_currency = Boolean(data?.supported_currencies.includes(currency.toLocaleLowerCase()));
    const is_p2p_enabled = is_p2p_supported_currency && !is_virtual && !is_low_risk_cr_eu_real;

    // Todo: should replace with the next line instead once BE is fixed.
    // const is_p2p_enabled = data?.disabled === 0;

    return {
        ...rest,
        data: is_p2p_enabled,
    };
};

export default useIsP2PEnabled;
