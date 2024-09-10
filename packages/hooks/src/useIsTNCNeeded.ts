import { useStore } from '@deriv/stores';

const useIsTNCNeeded = () => {
    const { client } = useStore();
    const { account_settings, landing_company_shortcode } = client;
    const { tnc_status } = account_settings || {};
    const is_tnc_needed = tnc_status?.[landing_company_shortcode] === 0;

    return is_tnc_needed;
};

export default useIsTNCNeeded;
