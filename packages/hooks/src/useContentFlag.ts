import { useStore } from '@deriv/stores';

const useContentFlag = () => {
    const { traders_hub } = useStore();
    const { content_flag } = traders_hub;

    return {
        low_risk_cr_non_eu: content_flag === 'low_risk_cr_non_eu',
        low_risk_cr_eu: content_flag === 'low_risk_cr_eu',
        high_risk_cr: content_flag === 'high_risk_cr',
        cr_demo: content_flag === 'cr_demo',
        eu_demo: content_flag === 'eu_demo',
        eu_real: content_flag === 'eu_real',
    };
};

export default useContentFlag;
