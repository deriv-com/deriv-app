import { FormatUtils } from '@deriv-com/utils';
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
    const formattedAmountIntended = FormatUtils.formatMoney(amount, {
        locale: options?.preferred_language ?? undefined,
        decimalPlaces: options?.fractional_digits,
    });
    const formattedAmountPrecise = FormatUtils.formatMoney(amount, {
        locale: options?.preferred_language ?? undefined,
    });

    // if formatting hurts precision, go for precision
    const formattedAmount =
        formattedAmountPrecise.length > formattedAmountIntended.length
            ? formattedAmountPrecise
            : formattedAmountIntended;

    return `${formattedAmount} ${currency}`;
};
