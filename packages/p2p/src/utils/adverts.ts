import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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

const getStatusLabel = (last_seen_online: number) => {
    const diff = dayjs.duration(dayjs().diff(dayjs.unix(last_seen_online)));

    if (diff.years()) return localize('Seen more than 6 months ago');

    if (diff.months()) {
        if (diff.months() > 6) {
            return localize('Seen more than 6 months ago');
        }
        return localize('Seen {{ duration }} months ago', {
            duration: diff.months(),
        });
    }
    if (diff.days()) {
        return localize('Seen {{ duration }} days ago', {
            duration: diff.days(),
        });
    }
    if (diff.hours()) {
        return localize('Seen {{ duration }} hours ago', {
            duration: diff.hours(),
        });
    }
    if (diff.minutes()) {
        return localize('Seen {{ duration }} minutes ago', {
            duration: diff.minutes(),
        });
    }
    return localize('Online');
};

export const getLastOnlineLabel = (is_online: 0 | 1, last_online_time?: number) => {
    if (!is_online) {
        if (last_online_time) {
            return getStatusLabel(last_online_time);
        }
        return localize('Seen more than 6 months ago');
    }
    return localize('Online');
};