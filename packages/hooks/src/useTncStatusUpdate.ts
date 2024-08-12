import { useStore } from '@deriv/stores';

export const useTncStatusUpdate = () => {
    const { client } = useStore();
    const { account_settings, landing_company_shortcode } = client;

    const { tnc_status } = account_settings || {};
    const need_tnc_status_update = tnc_status?.[landing_company_shortcode] === 0;
    return need_tnc_status_update;
};

export default useTncStatusUpdate;
