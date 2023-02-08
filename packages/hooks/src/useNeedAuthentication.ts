import { useStore } from '@deriv/stores';
import { ContentFlag } from '@deriv/shared';

const useNeedAuthentication = () => {
    const { client, traders_hub } = useStore();
    const { is_authentication_needed } = client;
    const { content_flag } = traders_hub;
    const is_eu = [ContentFlag.LOW_RISK_CR_EU, ContentFlag.EU_REAL].includes(content_flag);
    const is_need_authentication = is_authentication_needed && is_eu;

    return is_need_authentication;
};

export default useNeedAuthentication;
