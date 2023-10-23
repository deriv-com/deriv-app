import type {
    useAvailableMT5Accounts,
    useCreateOtherCFDAccount,
    useCtraderAccountsList,
    useDxtradeAccountsList,
    useMT5AccountsList,
    useSortedMT5Accounts,
} from '@deriv/api';

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace THooks {
    export type AvailableMT5Accounts = NonNullable<ReturnType<typeof useAvailableMT5Accounts>['data']>[number];
    export type CtraderAccountsList = NonNullable<ReturnType<typeof useCtraderAccountsList>['data']>[number];
    export type DxtradeAccountsList = NonNullable<ReturnType<typeof useDxtradeAccountsList>['data']>[number];
    export type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type SortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
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

// NOTE: If in the future there is a case where we need a specific display balance from a hook, refactor this into another namespace
export type TDisplayBalance =
    | THooks.CtraderAccountsList['display_balance']
    | THooks.DxtradeAccountsList['display_balance']
    | THooks.MT5AccountsList['display_balance'];
