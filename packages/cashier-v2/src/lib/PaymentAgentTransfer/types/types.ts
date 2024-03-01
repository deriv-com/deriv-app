import { useActiveAccount } from '@deriv/api';
import type { TCurrency } from '../../../types';
import { usePaymentAgentDetails, usePaymentAgentTransfer } from '../hooks';

export type TPaymentAgentTransfer = ReturnType<typeof usePaymentAgentTransfer>;
export type TPaymentAgentDetails = NonNullable<ReturnType<typeof usePaymentAgentDetails>['data']>;
export type TActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;

export type TInitialTransferFormValues = {
    amount: string;
    description: string;
    loginid: string;
};

export type TReceipt = {
    amount: string;
    clientID: string;
    clientName: string;
    currency: TCurrency;
};

export type TConfirm = TReceipt & {
    description: string;
};
