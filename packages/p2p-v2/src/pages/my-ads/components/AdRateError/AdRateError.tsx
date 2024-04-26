import { RATE_TYPE } from '@/constants';
import { useFloatingRate } from '@/hooks';
import { useAuthorize } from '@deriv/api-v2';

const AdRateError = () => {
    const { data } = useAuthorize();
    const { fixedRateAdvertsEndDate, rateType, reachedTargetDate } = useFloatingRate();

    const localCurrency = data.local_currencies?.[0];

    if (rateType === RATE_TYPE.FLOAT) {
        return reachedTargetDate || !fixedRateAdvertsEndDate
            ? //TODO: handle translation
              'Your ads with fixed rates have been deactivated. Set floating rates to reactivate them.'
            : `Floating rates are enabled for ${localCurrency}. Ads with fixed rates will be deactivated. Switch to floating rates by ${fixedRateAdvertsEndDate}.`;
    }

    return 'Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.';
};

export default AdRateError;
