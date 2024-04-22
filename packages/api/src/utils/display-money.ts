import { useAuthorize } from '../hooks';

type TCurrency = NonNullable<ReturnType<typeof useAuthorize>['data']['currency']>;
type TPreferredLanguage = ReturnType<typeof useAuthorize>['data']['preferred_language'];

export const displayMoney = (
    amount: number,
    currency: TCurrency,
    options?: {
        fractional_digits?: number;
        preferred_language?: TPreferredLanguage;
    }
) => {
    try {
        return `${Intl.NumberFormat(options?.preferred_language || 'en-US', {
            minimumFractionDigits: options?.fractional_digits || 2,
            maximumFractionDigits: options?.fractional_digits || 2,
            minimumIntegerDigits: 1,
        }).format(amount)} ${currency}`;
    } catch (error) {
        return `${amount} ${currency}`;
    }
};
