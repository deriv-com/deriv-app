import { ContentFlag } from '@deriv/shared';
import { useStore } from '@deriv/stores';

const useContentFlag = () => {
    const { traders_hub } = useStore();
    const content_flag = traders_hub?.content_flag;

    return {
        is_low_risk_cr_non_eu: content_flag === ContentFlag.LOW_RISK_CR_NON_EU,
        is_low_risk_cr_eu: content_flag === ContentFlag.LOW_RISK_CR_EU,
        is_high_risk_cr: content_flag === ContentFlag.HIGH_RISK_CR,
        is_cr_demo: content_flag === ContentFlag.CR_DEMO,
        is_eu_demo: content_flag === ContentFlag.EU_DEMO,
        is_eu_real: content_flag === ContentFlag.EU_REAL,
    };
};

export default useContentFlag;
