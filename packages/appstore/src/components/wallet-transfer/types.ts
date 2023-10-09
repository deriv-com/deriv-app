import { useTransferBetweenAccounts } from '@deriv/hooks';

export type TInitialValues = {
    to_amount: number;
    from_amount: number;
    to_account: ReturnType<typeof useTransferBetweenAccounts>['active_wallet'];
    from_account: ReturnType<typeof useTransferBetweenAccounts>['active_wallet'];
};
