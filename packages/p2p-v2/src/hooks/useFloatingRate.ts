import { RATE_TYPE } from '@/constants';
import { p2p } from '@deriv/api-v2';

type TReturnType = {
    fixedRateAdvertsEndDate: string;
    floatRateOffsetLimitString: string;
    rateType: typeof RATE_TYPE[keyof typeof RATE_TYPE];
    reachedTargetDate: boolean;
};

const useFloatingRate = (): TReturnType => {
    // TODO: to implement rest of the floating rate functionalities
    const { data } = p2p.settings.useGetSettings();
    const isFloatingRateEnabled = data?.float_rate_adverts === 'enabled';
    const fixedRateAdvertsEndDate = data?.fixed_rate_adverts_end_date ?? '';
    const reachedTargetDate = data?.reached_target_date ?? false;
    const floatRateOffsetLimitString = data?.float_rate_offset_limit_string ?? '';

    return {
        fixedRateAdvertsEndDate,
        floatRateOffsetLimitString,
        rateType: isFloatingRateEnabled ? RATE_TYPE.FLOAT : RATE_TYPE.FIXED,
        reachedTargetDate,
    };
};

export default useFloatingRate;
