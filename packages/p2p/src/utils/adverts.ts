import { getDiffDuration, toMoment, epochToMoment } from '@deriv/shared';
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

export const getLastOnlineLabel = (is_online, last_online_time) => {
    if (!is_online) {
        if (last_online_time) {
            const start_time = epochToMoment(last_online_time).unix();
            const end_time = toMoment().unix();
            const diff = getDiffDuration(start_time, end_time);

            if (diff.years()) return localize('Seen more than 6 months ago');
            if (diff.months()) {
                if (diff.months() > 6) {
                    return localize('Seen more than 6 months ago');
                }
                if (diff.months() === 1) {
                    return localize('Seen {{ duration }} month ago', {
                        duration: diff.months(),
                    });
                }
                return localize('Seen {{ duration }} months ago', {
                    duration: diff.months(),
                });
            }
            if (diff.days()) {
                if (diff.days() === 1) {
                    return localize('Seen {{ duration }} day ago', {
                        duration: diff.days(),
                    });
                }
                return localize('Seen {{ duration }} days ago', {
                    duration: diff.days(),
                });
            }
            if (diff.hours()) {
                if (diff.hours() === 1) {
                    return localize('Seen {{ duration }} hour ago', {
                        duration: diff.hours(),
                    });
                }
                return localize('Seen {{ duration }} hours ago', {
                    duration: diff.hours(),
                });
            }
            if (diff.minutes()) {
                if (diff.minutes() === 1) {
                    return localize('Seen {{ duration }} minute ago', {
                        duration: diff.minutes(),
                    });
                }
                return localize('Seen {{ duration }} minutes ago', {
                    duration: diff.minutes(),
                });
            }
        } else {
            return localize('Seen more than 6 months ago');
        }
    }
    return localize('Online');
};