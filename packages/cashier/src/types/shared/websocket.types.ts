import {
    GetAccountSettingsResponse,
    PaymentAgentDetailsResponse,
    PaymentAgentTransferResponse,
    PaymentAgentWithdrawResponse,
} from '@deriv/api-types';
import { TExtendedPaymentAgentListResponse } from 'Types';

export type TServerError = {
    code: string;
    details?: { [key: string]: string };
    message: string;
};

type TPassthrough = {
    [k: string]: unknown;
};

export type TPaymentAgentWithdrawRequest = {
    amount: string;
    currency: string;
    dry_run?: number;
    loginid: string;
    verification_code: string;
};

type TStorage = {
    getSettings: () => Promise<GetAccountSettingsResponse>;
};

export type TPaymentAgentTransferRequest = {
    amount: string;
    currency: string;
    description: string;
    dry_run?: number;
    transfer_to: string;
};

type TWebSocketCall = {
    cashier: (action: any, parameters: any) => Promise<any>;
    paymentAgentDetails: (passthrough?: TPassthrough, req_id?: number) => Promise<PaymentAgentDetailsResponse>;
    paymentAgentList: (residence: string, currency: string) => Promise<TExtendedPaymentAgentListResponse>;
    paymentAgentTransfer: ({
        amount,
        currency,
        description,
        transfer_to,
        dry_run,
    }: TPaymentAgentTransferRequest) => Promise<PaymentAgentTransferResponse>;
    paymentAgentWithdraw: ({
        loginid,
        currency,
        amount,
        verification_code,
        dry_run,
    }: TPaymentAgentWithdrawRequest) => Promise<PaymentAgentWithdrawResponse>;
    storage: TStorage;
};

export type TWebSocket = {
    allPaymentAgentList: (residence: string) => Promise<TExtendedPaymentAgentListResponse>;
    send: (obj: any) => Promise<any>;
    wait: (value: string) => Promise<any>;
    authorized: TWebSocketCall;
};
