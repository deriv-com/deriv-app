export const mockAccountLimits = {
    account_balance: null,
    lifetime_limit: 99999999,
    market_specific: {
        commodities: [
            {
                level: 'market',
                name: 'Commodities',
                payout_limit: 5000,
                profile_name: 'moderate_risk',
                turnover_limit: 50000,
            },
        ],
        forex: [
            {
                level: 'submarket',
                name: 'Minor Pairs',
                payout_limit: 5000,
                profile_name: 'moderate_risk',
                turnover_limit: 50000,
            },
        ],
    },
    num_of_days: 30,
    num_of_days_limit: 99999999,
    open_positions: 100,
    payout: 50000,
    remainder: 99999999,
    withdrawal_for_x_days_monetary: 0,
    withdrawal_since_inception_monetary: 0,
};

export const mockFormattedAccountsLimits = [
    { category: 'header', title: 'Trading limits', value: 'Limit' },
    {
        hintInfo:
            'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.',
        title: '*Maximum number of open positions',
        value: 100,
    },
    {
        hintInfo:
            'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.',
        title: '*Maximum account cash balance',
        value: 'Not set',
    },
    {
        hintInfo:
            'Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.',
        title: 'Maximum aggregate payouts on open positions',
        value: '50,000.00',
    },
    {
        category: 'footer',
        title: '*Any limits in your Self-exclusion settings will override these default limits.',
    },
    {
        category: 'header',
        hintInfo: 'Represents the maximum volume of contracts that you may purchase in any given trading day.',
        title: 'Maximum daily turnover',
        value: 'Limit',
    },
    { category: 'market', title: 'Commodities', value: '50,000.00' },
    { category: 'submarket', title: 'Minor Pairs', value: '50,000.00' },
    { category: 'header', title: 'Withdrawal limits', value: 'Limit' },
    { title: 'Total withdrawal allowed', value: '99,999,999.00' },
    { title: 'Total withdrawn', value: '0.00' },
    { title: 'Maximum withdrawal remaining', value: '99,999,999.00' },
    {
        category: 'footer',
        isLessProminent: true,
        title: 'Stated limits are subject to change without prior notice.',
    },
];
