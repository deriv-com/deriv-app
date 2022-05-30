import { localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes.js';

export const generateErrorDialogTitle = error_code => {
    if (error_code === api_error_codes.ADVERT_SAME_LIMITS) {
        return localize('You already have an ad with this range');
    } else if (error_code === api_error_codes.DUPLICATE_ADVERT) {
        return localize('You already have an ad with this rate');
    }
    return localize("Something's not right");
};
