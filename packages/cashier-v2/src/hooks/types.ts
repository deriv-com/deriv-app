import {
    useAccountLimits,
    useActiveAccount,
    useAllAccountsList,
    useCreateOtherCFDAccount,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useMT5AccountsList,
    usePaymentAgentList,
    useSortedMT5Accounts,
    useTransferBetweenAccounts,
} from '@deriv/api-v2';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace THooks {
    export type Accounts = NonNullable<ReturnType<typeof useAllAccountsList>['data']>;
    export type AccountLimits = NonNullable<ReturnType<typeof useAccountLimits>['data']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type CryptoWithdrawal = NonNullable<ReturnType<typeof useCryptoWithdrawal>['mutateAsync']>;
    export type CurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['data']>[string];
    export type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type SortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
    export type TransferAccounts = NonNullable<
        NonNullable<ReturnType<typeof useTransferBetweenAccounts>['data']>['accounts']
    >;
    export type PaymentAgentList = NonNullable<ReturnType<typeof usePaymentAgentList>['data']>;
}

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TMarketTypes {
    export type All = CreateOtherCFDAccount | SortedMT5Accounts;
    export type CreateOtherCFDAccount = Parameters<
        NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
    >[0]['payload']['market_type'];
    export type SortedMT5Accounts = Exclude<THooks.SortedMT5Accounts['market_type'], undefined>;
}

export type TMT5LandingCompanyName = THooks.MT5AccountsList['landing_company_short'];
