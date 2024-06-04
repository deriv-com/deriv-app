import { useAuthorize } from '@deriv/api-v2';

type TCurrency = NonNullable<ReturnType<typeof useAuthorize>['data']['currency']>;
type TPreferredLanguage = ReturnType<typeof useAuthorize>['data']['preferred_language'];

/**
 * @description Display money in a human-readable format
 * @param amount - The amount to be formatted
 * @param currency - The currency to be displayed
 * @param options - Additional options for formatting
 * @returns The formatted money
 */
export const displayMoney = (
    amount: number,
    currency: TCurrency,
    options?: {
        // eslint-disable-next-line camelcase
        fractional_digits?: number;
        // eslint-disable-next-line camelcase
        preferred_language?: TPreferredLanguage;
    }
) => {
    try {
        return `${Intl.NumberFormat(options?.preferred_language ?? 'en-US', {
            minimumFractionDigits: options?.fractional_digits ?? 2,
            maximumFractionDigits: options?.fractional_digits ?? 2,
            minimumIntegerDigits: 1,
        }).format(amount)} ${currency}`;
    } catch (error) {
        return `${amount} ${currency}`;
    }
};
