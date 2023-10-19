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
    export type TAvailableMT5Accounts = NonNullable<ReturnType<typeof useAvailableMT5Accounts>['data']>[number];
    export type TCtraderAccountsList = NonNullable<ReturnType<typeof useCtraderAccountsList>['data']>[number];
    export type TDxtradeAccountsList = NonNullable<ReturnType<typeof useDxtradeAccountsList>['data']>[number];
    export type TMT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type TSortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TPlatforms {
    export type TAll = TMT5 | TOtherAccounts;
    export type TMT5 = THooks.TAvailableMT5Accounts['platform'];
    export type TOtherAccounts =
        | Parameters<NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>>[0]['payload']['platform'];
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TMarketTypes {
    export type TAll = TCreateOtherCFDAccount | TSortedMT5Accounts;
    export type TCreateOtherCFDAccount = Parameters<
        NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
    >[0]['payload']['market_type'];
    export type TSortedMT5Accounts = Exclude<THooks.TSortedMT5Accounts['market_type'], undefined>;
}
