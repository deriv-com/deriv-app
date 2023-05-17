import { ContentFlag } from '@deriv/shared';
import { useStore } from '@deriv/stores';

const useContentFlag = () => {
    const { traders_hub } = useStore();
    const { content_flag } = traders_hub;

    return {
        low_risk_cr_non_eu: content_flag === ContentFlag.LOW_RISK_CR_NON_EU,
        low_risk_cr_eu: content_flag === ContentFlag.LOW_RISK_CR_EU,
        high_risk_cr: content_flag === ContentFlag.HIGH_RISK_CR,
        cr_demo: content_flag === ContentFlag.CR_DEMO,
        eu_demo: content_flag === ContentFlag.EU_DEMO,
        eu_real: content_flag === ContentFlag.EU_REAL,
    };
};

export default useContentFlag;
