import type {
    useActiveAccount,
    useActiveTradingAccount,
    useAllAccountsList,
    useAuthentication,
    useAvailableMT5Accounts,
    useCreateOtherCFDAccount,
    useCtraderAccountsList,
    useCurrencyConfig,
    useDerivAccountsList,
    useDxtradeAccountsList,
    useDynamicLeverage,
    useGetExchangeRate,
    useMT5AccountsList,
    usePOA,
    usePOI,
    useSortedMT5Accounts,
} from '@deriv/api-v2';

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace THooks {
    export type Authentication = NonNullable<ReturnType<typeof useAuthentication>['data']>;
    export type AvailableMT5Accounts = NonNullable<ReturnType<typeof useAvailableMT5Accounts>['data']>[number];
    export type CtraderAccountsList = NonNullable<ReturnType<typeof useCtraderAccountsList>['data']>[number];
    export type DxtradeAccountsList = NonNullable<ReturnType<typeof useDxtradeAccountsList>['data']>[number];
    export type ExchangeRate = NonNullable<ReturnType<typeof useGetExchangeRate>['data']>;
    export type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type SortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
    export type DerivAccountsList = NonNullable<ReturnType<typeof useDerivAccountsList>['data']>[number];
    export type ActiveTradingAccount = NonNullable<ReturnType<typeof useActiveTradingAccount>['data']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type AllAccountsList = NonNullable<ReturnType<typeof useAllAccountsList>>['data'];
    export type DynamicLeverage = NonNullable<ReturnType<typeof useDynamicLeverage>['data']>;
    export type POA = NonNullable<ReturnType<typeof usePOA>['data']>;
    export type POI = NonNullable<ReturnType<typeof usePOI>['data']>;
    export type CurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['data']>[string];
    export type GetCurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['getConfig']>;
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TPlatforms {
    export type All = MT5 | OtherAccounts | SortedMT5Accounts;
    export type MT5 = THooks.AvailableMT5Accounts['platform'];
    export type OtherAccounts = Exclude<
        Parameters<NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>>[0]['payload']['platform'],
        'derivez'
    >;
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
    export type AccountsList = THooks.DerivAccountsList['display_balance'];
    export type ActiveTradingAccount = THooks.ActiveTradingAccount['display_balance'];
}

export type TLandingCompanyName = Extract<THooks.MT5AccountsList['landing_company_short'], 'malta' | 'svg'> | 'virtual';
export type TMT5LandingCompanyName = THooks.MT5AccountsList['landing_company_short'];
export type TJurisdiction = THooks.MT5AccountsList['landing_company_short'];
