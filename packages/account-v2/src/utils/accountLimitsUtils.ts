import { GetLimits } from '@deriv/api-types';
import { CurrencyConstants, FormatUtils } from '@deriv-com/utils';

export const getAccountLimitValues = (accountLimits: GetLimits, currency: CurrencyConstants.Currency) => {
    const { account_balance: accountBalance, open_positions: openPositions, payout = 0 } = accountLimits;
    return [
        {
            isHeader: true,
            title: 'Trading limits',
            value: 'Limit',
        },
        {
            hintInfo:
                'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.',
            title: '*Maximum number of open positions',
            value: openPositions,
        },
        {
            hintInfo:
                'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.',
            title: '*Maximum account cash balance',
            value: accountBalance ? FormatUtils.formatMoney(accountBalance, { currency }) : 'Not set',
        },
        {
            hintInfo:
                'Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.',
            title: 'Maximum aggregate payouts on open positions',
            value: FormatUtils.formatMoney(payout, { currency }),
        },
        {
            isFooter: true,
            title: '*Any limits in your Self-exclusion settings will override these default limits.',
        },
        {
            isHeader: true,
            title: 'Maximum daily turnover',
            value: '0.00',
        },
        {
            hintInfo:
                'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.',
            title: 'Commodities',
            value: 'open_positions',
        },
        {
            title: 'Forex',
            value: 'Not set',
        },
        {
            isSubCategory: true,
            title: 'Major pairs',
            value: '10',
        },
        {
            isSubCategory: true,
            title: 'Minor Pairs',
            value: '10',
        },

        {
            title: 'Stock Indices',
            value: '0.00',
        },
        {
            title: 'Forex',
            value: 'Not set',
        },

        {
            isSubCategory: true,
            title: 'Commodities Basket',
            value: 'ss',
        },
        {
            isSubCategory: true,
            title: 'Forex Basket',
            value: '',
        },
        {
            isHeader: true,
            title: 'Withdrawal limits',
            value: 'Limits',
        },
        {
            isFooter: true,
            isLessProminent: true,
            title: 'Your account is fully authenticated and your withdrawal limits have been lifted',
        },
    ];
};
