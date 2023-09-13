import { localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';

/**
 * Function to generate localized error title for the corresponding error code
 *
 * @param {string} error_code - The error code returned from the API
 * @returns {string} The title for the error dialog
 */
export const generateErrorDialogTitle = (error_code: string): string => {
    switch (error_code) {
        case api_error_codes.ADVERT_SAME_LIMITS:
            return localize('You already have an ad with this range');
        case api_error_codes.DUPLICATE_ADVERT:
            return localize('You already have an ad with this rate');
        default:
            return localize("Something's not right");
    }
};

/**
 * Function to generate the error message for the error dialog based on the given error code and message.
 *
 * @param {string} error_code - The error code to determine the error message for.
 * @param {string} error_message - The custom error message to be displayed, if applicable.
 * @returns {string} The error message for the dialog.
 */
export const generateErrorDialogBody = (error_code: string, error_message?: string): string => {
    switch (error_code) {
        case api_error_codes.ADVERT_SAME_LIMITS:
            return localize(
                'Please set a different minimum and/or maximum order limit. \n\nThe range of your ad should not overlap with any of your active ads.'
            );
        case api_error_codes.DUPLICATE_ADVERT:
            return localize(
                'You already have an ad with the same exchange rate for this currency pair and order type. \n\nPlease set a different rate for your ad.'
            );
        default:
            return error_message ?? localize("Something's not right");
    }
};
