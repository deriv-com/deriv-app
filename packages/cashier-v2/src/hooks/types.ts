import { useAccountLimits, useActiveAccount, useCryptoWithdrawal } from '@deriv/api-v2';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace THooks {
    export type AccountLimits = NonNullable<ReturnType<typeof useAccountLimits>['data']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type CryptoWithdrawal = NonNullable<ReturnType<typeof useCryptoWithdrawal>['mutateAsync']>;
}
