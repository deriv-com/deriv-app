import { GetLimits } from '@deriv/api-types';
import { CurrencyConstants, FormatUtils } from '@deriv-com/utils';

export const CATEGORY = {
    footer: 'footer',
    header: 'header',
    submarket: 'submarket',
};

export type TAccountLimitValues = {
    category?: string;
    hintInfo?: string;
    isLessProminent?: boolean;
    title: string;
    value?: number | string;
};

const getTradingLimitsTableData = (
    currency: CurrencyConstants.Currency,
    openPositions: number,
    payout: number,
    accountBalance?: number
): TAccountLimitValues[] => [
    {
        category: CATEGORY.header,
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
        category: CATEGORY.footer,
        title: '*Any limits in your Self-exclusion settings will override these default limits.',
    },
];
type TMarketSpecific = GetLimits['market_specific'];
const getMarketValues = (collection: any, currency: any) => {
    const formattedCollection = collection
        ?.slice()
        .sort((a: FormikValues, b: FormikValues) => (a.level > b.level ? 1 : -1));

    return formattedCollection?.map(data => ({
        category: data?.level,
        title: data?.name,
        value: FormatUtils.formatMoney(data?.turnover_limit, { currency }),
    }));
};

const getMaximumDailyLimiitsTableData = (marketSpecific: any, currency) => {
    const markets = ['commodities', 'forex', 'indices', 'synthetic_index'];
    return [
        {
            category: CATEGORY.header,
            hintInfo: 'Represents the maximum volume of contracts that you may purchase in any given trading day.',
            title: 'Maximum daily turnover',
            value: 'Limit',
        },
        ...markets.flatMap(market => getMarketValues(marketSpecific[market], currency)),
    ];
};

const getWithdrawalLimitsTableData = (
    isAuthenticated = false,
    numberOfDaysLimit?: number,
    withdrawalSinceInceptionMonetary?: number,
    remainder?: number,
    currency: any
) => [
    {
        category: CATEGORY.header,
        title: 'Withdrawal limits',
        value: 'Limit',
    },
    ...(!isAuthenticated
        ? [
              {
                  title: 'Total withdrawal allowed',
                  value: FormatUtils.formatMoney(numberOfDaysLimit ?? 0, { currency }),
              },
              {
                  title: 'Total withdrawn',
                  value: FormatUtils.formatMoney(withdrawalSinceInceptionMonetary ?? 0, { currency }),
              },
              {
                  title: 'Maximum withdrawal remaining',
                  value: FormatUtils.formatMoney(remainder ?? 0, { currency }),
              },
          ]
        : []),
    {
        category: CATEGORY.footer,
        isLessProminent: true,
        title: isAuthenticated
            ? 'Your account is fully authenticated and your withdrawal limits have been lifted'
            : 'Stated limits are subject to change without prior notice.',
    },
];

export const getAccountLimitValues = (accountLimits: GetLimits, isAuthenticated?: boolean, currency?: string) => {
    const {
        account_balance: accountBalance,
        market_specific: marketSpecific,
        num_of_days_limit: numberOfDaysLimit,
        open_positions: openPositions,
        payout = 0,
        remainder,
        withdrawal_since_inception_monetary: withdrawalSinceInceptionMonetary,
    } = accountLimits;

    return [
        ...getTradingLimitsTableData(currency, openPositions, payout, accountBalance),
        ...getMaximumDailyLimiitsTableData(marketSpecific, currency),
        ...getWithdrawalLimitsTableData(
            isAuthenticated,
            numberOfDaysLimit,
            withdrawalSinceInceptionMonetary,
            remainder,
            currency
        ),
    ];
};
