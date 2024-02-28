import {
    useAccountLimits,
    useActiveAccount,
    useAllAccountsList,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useTransferBetweenAccounts,
} from '@deriv/api';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace THooks {
    export type Accounts = NonNullable<ReturnType<typeof useAllAccountsList>['data']>;
    export type AccountLimits = NonNullable<ReturnType<typeof useAccountLimits>['data']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type CryptoWithdrawal = NonNullable<ReturnType<typeof useCryptoWithdrawal>['mutateAsync']>;
    export type CurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['data']>[string];
    export type TransferAccount = NonNullable<
        NonNullable<ReturnType<typeof useTransferBetweenAccounts>['data']>['accounts']
    >[number];
}
