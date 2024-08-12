import { useStore } from '@deriv/stores';

export const useTncStatusUpdate = () => {
    const { client } = useStore();
    const { account_settings, landing_company_shortcode } = client;

    const { tnc_status } = account_settings || {};
    const is_tnc_status_updated = tnc_status?.[landing_company_shortcode] === 0;
    return is_tnc_status_updated;
};

export default useTncStatusUpdate;
