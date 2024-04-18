import { ChangeEvent, MouseEvent } from 'react';
import { TCountryListItem } from 'types';
import { ERROR_CODES, RATE_TYPE } from '@/constants';
import { rangeValidator } from './format-value';
import { countDecimalPlaces, decimalValidator } from './string';

/**
 * Determines whether to show a tooltip icon based on the visibility status.
 * A tooltip icon should be shown if:
 * - There is only one visibility status and it is not equal to `ERROR_CODES.ADVERT_INACTIVE`
 *   or `ERROR_CODES.ADVERTISER_ADS_PAUSED`.
 * - There are multiple visibility statuses.
 *
 * @param {string[]} visibilityStatus - The array of visibility statuses.
 * @returns {boolean} Returns `true` if a tooltip icon should be shown, otherwise `false`.
 */
export const shouldShowTooltipIcon = (visibilityStatus: string[]) =>
    (visibilityStatus?.length === 1 &&
        visibilityStatus[0] !== ERROR_CODES.ADVERT_INACTIVE &&
        visibilityStatus[0] !== ERROR_CODES.ADVERTISER_ADS_PAUSED) ||
    visibilityStatus.length > 1;

/**
 * Determines the visibility error codes based on the provided parameters.
 *
 * @param {string[]} visibilityStatus - The array of existing visibility status codes.
 * @param {boolean} enableActionPoint - A boolean indicating whether the action point is enabled.
 * @param {boolean} isAdvertListed - A boolean indicating whether the advert is listed.
 * @returns {string[]} Returns an updated array of visibility status codes.
 */
export const getVisibilityErrorCodes = (
    visibilityStatus: string[],
    enableActionPoint: boolean,
    isAdvertListed: boolean
) => {
    let updatedVisibilityStatus = [...visibilityStatus];
    if (!isAdvertListed && !updatedVisibilityStatus.includes(ERROR_CODES.ADVERTISER_ADS_PAUSED))
        updatedVisibilityStatus = [...updatedVisibilityStatus, ERROR_CODES.ADVERTISER_ADS_PAUSED];
    if (!enableActionPoint && updatedVisibilityStatus.includes(ERROR_CODES.ADVERT_INACTIVE))
        updatedVisibilityStatus = updatedVisibilityStatus.filter(status => status !== ERROR_CODES.ADVERT_INACTIVE);
    if (enableActionPoint && !updatedVisibilityStatus.includes(ERROR_CODES.ADVERT_INACTIVE))
        updatedVisibilityStatus = [...updatedVisibilityStatus, ERROR_CODES.ADVERT_INACTIVE];
    return updatedVisibilityStatus;
};

type ValidationRules = {
    [key: string]: (value: string) => boolean | string;
};

const requiredValidation = (value: string, field: string) => !!value || `${field} is required`;
const decimalPointValidation = (value: string) =>
    (Number(value) > 0 && decimalValidator(value) && countDecimalPlaces(value) <= 2) ||
    'Only up to 2 decimals are allowed.';
export const getValidationRules = (
    fieldName: string,
    getValues: (fieldName: string) => number | string
): ValidationRules => {
    switch (fieldName) {
        case 'amount':
            return {
                validation_1: value => requiredValidation(value, 'Amount'),
                validation_2: value => !isNaN(Number(value)) || 'Enter a valid amount',
                validation_3: value => decimalPointValidation(value),
                validation_4: value => {
                    const minOrder = getValues('min-order');
                    if (minOrder && Number(value) < Number(minOrder)) {
                        return 'Amount should not be below Min limit';
                    }
                    return true;
                },
                validation_5: value => {
                    const maxOrder = getValues('max-order');
                    if (maxOrder && Number(value) < Number(maxOrder)) {
                        return 'Amount should not be below Max limit';
                    }
                    return true;
                },
            };
        case 'rate-value':
            return {
                validation_1: value => requiredValidation(value, 'Fixed rate'),
                validation_2: value => !isNaN(Number(value)) || 'Enter a valid amount',
                validation_3: value => {
                    if (getValues('rate-type-string') === RATE_TYPE.FIXED) {
                        return decimalPointValidation(value);
                    }
                    return true;
                },
                validation_4: value => {
                    const limitValue = getValues('float-rate-offset-limit');
                    if (
                        value &&
                        getValues('rate-type-string') === RATE_TYPE.FLOAT &&
                        !rangeValidator(parseFloat(value), Number(limitValue))
                    ) {
                        return `Enter a value that's within -${limitValue}% to +${limitValue}%`;
                    }
                    return true;
                },
            };
        case 'min-order':
            return {
                validation_1: value => requiredValidation(value, 'Min limit'),
                validation_2: value => !isNaN(Number(value)) || 'Only numbers are allowed',
                validation_3: value => decimalPointValidation(value),
                validation_4: value => {
                    const amount = getValues('amount');
                    if (getValues('amount') && Number(value) > Number(amount)) {
                        return 'Min limit should not exceed Amount';
                    }
                    return true;
                },
                validation_5: value => {
                    const maxOrder = getValues('max-order');
                    if (maxOrder && Number(value) > Number(maxOrder)) {
                        return 'Min limit should not exceed Max limit';
                    }
                    return true;
                },
            };
        case 'max-order':
            return {
                validation_1: value => requiredValidation(value, 'Max limit'),
                validation_2: value => !isNaN(Number(value)) || 'Only numbers are allowed',
                validation_3: value => decimalPointValidation(value),
                validation_4: value => {
                    const amount = getValues('amount');
                    if (amount && Number(value) > Number(amount)) {
                        return 'Max limit should not exceed Amount';
                    }
                    return true;
                },
                validation_5: value => {
                    const minOrder = getValues('min-order');
                    if (minOrder && Number(value) < Number(minOrder)) {
                        return 'Max limit should not be below Min limit';
                    }
                    return true;
                },
            };
        default:
            return {};
    }
};

export const getFilteredCountryList = (countryList: TCountryListItem, paymentMethods?: string[]) => {
    if (!paymentMethods || paymentMethods?.length === 0) return countryList;
    return (
        countryList &&
        Object.keys(countryList)
            .filter(key => {
                const paymentMethodsKeys = Object.keys(countryList[key]?.payment_methods || {});
                return paymentMethods.some(method => paymentMethodsKeys.includes(method));
            })
            .reduce((obj, key) => {
                obj[key] = countryList[key];
                return obj;
            }, {})
    );
};

export const restrictDecimalPlace = (
    e: ChangeEvent<HTMLInputElement>,
    handleChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void
): void => {
    const pattern = new RegExp(/^[+-]?\d{0,4}(\.\d{0,2})?$/);
    if ((e.target as HTMLInputElement).value.length > 8) {
        (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.slice(0, 8);
        return;
    }
    if (pattern.test((e.target as HTMLInputElement).value)) {
        handleChangeCallback(e);
    }
};
