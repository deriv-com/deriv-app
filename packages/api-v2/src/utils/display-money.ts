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
        const fractional_digits = Math.max(
            // whichever is bigger:
            options?.fractional_digits || 2, // currency's number of decimal places
            [...amount.toString()].reverse().indexOf('.') // amount's decimal places
        );

        return `${Intl.NumberFormat(options?.preferred_language || 'en-US', {
            minimumFractionDigits: fractional_digits,
            maximumFractionDigits: fractional_digits,
            minimumIntegerDigits: 1,
        }).format(amount)} ${currency}`;
    } catch (error) {
        return `${amount} ${currency}`;
    }
};
