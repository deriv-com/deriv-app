import { RATE_TYPE } from '@/constants';
import { p2p } from '@deriv/api-v2';

type TReturnType = {
    rateType: typeof RATE_TYPE[keyof typeof RATE_TYPE];
};

const useFloatingRate = (): TReturnType => {
    // TODO: to implement rest of the floating rate functionalities
    const { data } = p2p.settings.useGetSettings();
    const isFloatingRateEnabled = data?.float_rate_adverts === 'enabled';

    return {
        rateType: isFloatingRateEnabled ? RATE_TYPE.FLOAT : RATE_TYPE.FIXED,
    };
};

export default useFloatingRate;
