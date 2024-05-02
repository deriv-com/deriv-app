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
        should_keep_precision?: boolean;
    }
) => {
    const intendedDecimalPlaces = options?.fractional_digits ?? 2;
    const decimalPlaces = options?.should_keep_precision
        ? Math.max(
              // whichever is bigger:
              intendedDecimalPlaces, // intended decimal places
              [...amount.toString()].reverse().indexOf('.') // amount value's decimal places
          )
        : intendedDecimalPlaces;

    const formattedAmount = FormatUtils.formatMoney(amount, {
        decimalPlaces,
        locale: options?.preferred_language ?? undefined,
    });

    return `${formattedAmount} ${currency}`;
};
