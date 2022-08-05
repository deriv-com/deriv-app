import React from 'react';
import { localize, Localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';

export const generateErrorDialogTitle = error_code => {
    if (error_code === api_error_codes.ADVERT_SAME_LIMITS) {
        return localize('You already have an ad with this range');
    } else if (error_code === api_error_codes.DUPLICATE_ADVERT) {
        return localize('You already have an ad with this rate');
    }
    return localize("Something's not right");
};

export const generateErrorDialogBody = (error_code, error_message) => {
    if (error_code === api_error_codes.ADVERT_SAME_LIMITS) {
        return (
            <Localize i18n_default_text='Please set a different minimum and/or maximum order limit. <br/><br/>The range of your ad should not overlap with any of your active ads.' />
        );
    } else if (error_code === api_error_codes.DUPLICATE_ADVERT) {
        return (
            <Localize i18n_default_text='You already have an ad with the same exchange rate for this currency pair and order type. <br/><br/>Please set a different rate for your ad.' />
        );
    }
    return error_message;
};
