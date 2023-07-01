import { useStore } from '@deriv/stores';

const useContentFlag = () => {
    const { traders_hub } = useStore();
    const { content_flag } = traders_hub;

    return {
        is_low_risk_cr_non_eu: content_flag === 'low_risk_cr_non_eu',
        is_low_risk_cr_eu: content_flag === 'low_risk_cr_eu',
        is_high_risk_cr: content_flag === 'high_risk_cr',
        is_cr_demo: content_flag === 'cr_demo',
        is_eu_demo: content_flag === 'eu_demo',
        is_eu_real: content_flag === 'eu_real',
    };
};

export default useContentFlag;
