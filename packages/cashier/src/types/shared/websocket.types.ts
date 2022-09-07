import { PaymentAgentDetailsResponse, PaymentAgentWithdrawResponse } from '@deriv/api-types';
import { TExtendedPaymentAgentListResponse } from 'Types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TPassthrough = {
    [k: string]: unknown;
};

export type TPaymentAgentWithdrawRequest = {
    loginid: string;
    currency: string;
    amount: string;
    verification_code: string;
    dry_run?: number;
};

type TWebSocketCall = {
    cashier: (action: any, parameters: any) => Promise<any>;
    paymentAgentDetails: (passthrough?: TPassthrough, req_id?: number) => Promise<PaymentAgentDetailsResponse>;
    paymentAgentList: (residence: string, currency: string) => Promise<TExtendedPaymentAgentListResponse>;
    paymentAgentWithdraw: ({
        loginid,
        currency,
        amount,
        verification_code,
        dry_run,
    }: TPaymentAgentWithdrawRequest) => Promise<PaymentAgentWithdrawResponse>;
};

export type TWebSocket = {
    allPaymentAgentList: (residence: string) => Promise<TExtendedPaymentAgentListResponse>;
    send: (obj: any) => Promise<any>;
    wait: (value: string) => Promise<any>;
    authorized: TWebSocketCall;
};
