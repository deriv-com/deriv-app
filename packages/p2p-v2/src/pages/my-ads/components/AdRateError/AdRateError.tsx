import { RATE_TYPE } from '@/constants';
import { useAuthorize } from '@deriv/api';

const AdRateError = () => {
    //TODO: get rate values after implementation of floatingRate hook
    const floatingRateValues = {
        rateType: RATE_TYPE.FLOAT,
        reachedTargetDate: false,
        fixedRateAdvertsEndDate: '2024/12/31',
    };

    const { data } = useAuthorize();

    const localCurrency = data.local_currencies?.[0];

    if (floatingRateValues.rateType === RATE_TYPE.FLOAT) {
        return floatingRateValues.reachedTargetDate
            ? //TODO: handle translation
              'Your ads with fixed rates have been deactivated. Set floating rates to reactivate them.'
            : `Floating rates are enabled for ${localCurrency}. Ads with fixed rates will be deactivated. Switch to floating rates by ${floatingRateValues.fixedRateAdvertsEndDate}.`;
    }

    return 'Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.';
};

export default AdRateError;
