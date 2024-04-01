import { p2p } from '@deriv/api-v2';

const useFloatingRate = () => {
    // TODO: to implement rest of the floating rate functionalities
    const { data } = p2p.settings.useGetSettings();
    const isFloatingRateEnabled = data?.float_rate_adverts === 'enabled';

    return {
        rateType: isFloatingRateEnabled ? 'float' : 'fixed',
    };
};

export default useFloatingRate;
