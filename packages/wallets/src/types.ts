import type {
    useAccountsList,
    useActiveAccount,
    useActiveTradingAccount,
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useAvailableWallets,
    useCreateOtherCFDAccount,
    useCryptoTransactions,
    useCtraderAccountsList,
    useCurrencyConfig,
    useDxtradeAccountsList,
    useDynamicLeverage,
    useMT5AccountsList,
    useSortedMT5Accounts,
    useTransactions,
    useWalletAccountsList,
} from '@deriv/api';

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace THooks {
    export type AvailableMT5Accounts = NonNullable<ReturnType<typeof useAvailableMT5Accounts>['data']>[number];
    export type CtraderAccountsList = NonNullable<ReturnType<typeof useCtraderAccountsList>['data']>[number];
    export type DxtradeAccountsList = NonNullable<ReturnType<typeof useDxtradeAccountsList>['data']>[number];
    export type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type SortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
    export type WalletAccountsList = NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
    export type ActiveWalletAccount = NonNullable<ReturnType<typeof useActiveWalletAccount>['data']>;
    export type AccountsList = NonNullable<ReturnType<typeof useAccountsList>['data']>[number];
    export type ActiveTradingAccount = NonNullable<ReturnType<typeof useActiveTradingAccount>['data']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type AvailableWallets = NonNullable<ReturnType<typeof useAvailableWallets>['data']>[number];
    export type DynamicLeverage = NonNullable<ReturnType<typeof useDynamicLeverage>['data']>[number];
    export type CryptoTransactions = NonNullable<ReturnType<typeof useCryptoTransactions>['data']>[number];
    export type CurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['data']>[string];
    export type Transactions = NonNullable<ReturnType<typeof useTransactions>['data']>[number];
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TPlatforms {
    export type All = MT5 | OtherAccounts | SortedMT5Accounts;
    export type MT5 = THooks.AvailableMT5Accounts['platform'];
    export type OtherAccounts =
        | Parameters<NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>>[0]['payload']['platform'];
    export type SortedMT5Accounts = THooks.SortedMT5Accounts['platform'];
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TMarketTypes {
    export type All = CreateOtherCFDAccount | SortedMT5Accounts;
    export type CreateOtherCFDAccount = Parameters<
        NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
    >[0]['payload']['market_type'];
    export type SortedMT5Accounts = Exclude<THooks.SortedMT5Accounts['market_type'], undefined>;
}

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TDisplayBalance {
    export type CtraderAccountsList = THooks.CtraderAccountsList['display_balance'];
    export type DxtradeAccountsList = THooks.DxtradeAccountsList['display_balance'];
    export type MT5AccountsList = THooks.MT5AccountsList['display_balance'];
    export type WalletAccountsList = THooks.WalletAccountsList['display_balance'];
    export type ActiveWalletAccount = THooks.ActiveWalletAccount['display_balance'];
    export type AccountsList = THooks.AccountsList['display_balance'];
    export type ActiveTradingAccount = THooks.ActiveTradingAccount['display_balance'];
}

export type TGenericSizes = '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '5xl' | '6xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';
