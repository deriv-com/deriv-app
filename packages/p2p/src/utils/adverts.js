import React from 'react';
import { getDiffDuration, toMoment, epochToMoment } from '@deriv/shared';
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
                if (diff.months === 1) {
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
