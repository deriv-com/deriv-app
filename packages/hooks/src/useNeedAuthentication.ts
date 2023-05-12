import { useStore } from '@deriv/stores';

const useNeedAuthentication = () => {
    const { client, traders_hub } = useStore();
    const { is_authentication_needed } = client;
    const { is_low_risk_cr_eu_real } = traders_hub;
    const is_need_authentication = is_authentication_needed && is_low_risk_cr_eu_real;

    return is_need_authentication;
};

export default useNeedAuthentication;
