import { FormatUtils } from '@deriv-com/utils';

export const getTradingLimitsTableData = (accountLimits, currency) => {
    const { account_balance: accountBalance, open_positions: openPositions, payout } = accountLimits;
    return [
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
            title: '*Any limits in your Self-exclusion settings will override these default limits.',
        },
    ];
};

export const getMaximumDailyLimiitsTableData = () => [
    {
        hintInfo:
            'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.',
        title: 'Commodities',
        value: 'open_positions',
    },
    {
        subCategory: [
            {
                title: 'Major pairs',
                value: '',
            },
            {
                title: 'Minor Pairs',
                value: '',
            },
        ],
        title: 'Forex',

        value: 'Not set',
    },
    {
        title: 'Stock Indices',
        value: '0.00',
    },
    {
        subCategory: [
            {
                title: 'Commodities Basket',
                value: '',
            },
            {
                title: 'Forex Basket',
                value: '',
            },
        ],
        title: 'Forex',
        value: 'Not set',
    },
];

export const getWithdrawalLimitsTableData = () => [
    {
        title: 'Your account is fully authenticated and your withdrawal limits have been lifted',
    },
];
