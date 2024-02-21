import { useAccountLimits, useActiveWalletAccount, useCryptoWithdrawal } from '@deriv/api';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace THooks {
    export type AccountLimits = NonNullable<ReturnType<typeof useAccountLimits>['data']>;
    export type ActiveWalletAccount = NonNullable<ReturnType<typeof useActiveWalletAccount>['data']>;
    export type CryptoWithdrawal = NonNullable<ReturnType<typeof useCryptoWithdrawal>['mutateAsync']>;
}
