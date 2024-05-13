import {
    useAccountLimits,
    useActiveAccount,
    useAllAccountsList,
    useCreateOtherCFDAccount,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    useMT5AccountsList,
    useMutation,
    usePaymentAgentList,
    useSortedMT5Accounts,
    useTransferBetweenAccounts,
} from '@deriv/api-v2';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace THooks {
    export type Accounts = NonNullable<ReturnType<typeof useAllAccountsList>['data']>;
    export type AccountLimits = NonNullable<ReturnType<typeof useAccountLimits>['data']>;
    export type AccountLimitsRefetch = NonNullable<ReturnType<typeof useAccountLimits>['refetch']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type CryptoWithdrawal = NonNullable<ReturnType<typeof useCryptoWithdrawal>['mutateAsync']>;
    export type CurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['data']>[string];
    export type ExchangeRatesSubscribable = NonNullable<ReturnType<typeof useExchangeRateSubscription>['data']>;
    export type GetCurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['getConfig']>;
    export type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type PaymentAgentList = NonNullable<ReturnType<typeof usePaymentAgentList>['data']>;
    export type ServiceToken = NonNullable<
        NonNullable<ReturnType<typeof useMutation<'service_token'>>['data']>['service_token']
    >;
    export type SortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
    export type TransferAccounts = NonNullable<
        NonNullable<ReturnType<typeof useTransferBetweenAccounts>['data']>['accounts']
    >;
    export type TransferBetweenAccounts = NonNullable<NonNullable<ReturnType<typeof useTransferBetweenAccounts>>>;
}

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TMarketTypes {
    export type All = CreateOtherCFDAccount | SortedMT5Accounts;
    export type CreateOtherCFDAccount = Parameters<
        NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
    >[0]['payload']['market_type'];
    export type SortedMT5Accounts = Exclude<THooks.SortedMT5Accounts['market_type'], undefined>;
}

export type TMT5LandingCompanyName = THooks.MT5AccountsList['landing_company'];
export type TMT5MarketType = THooks.MT5AccountsList['market_type'];
