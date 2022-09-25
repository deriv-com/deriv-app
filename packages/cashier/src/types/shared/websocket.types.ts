import {
    CashierInformationRequest,
    CashierInformationResponse,
    ExchangeRatesRequest,
    ExchangeRatesResponse,
} from '@deriv/api-types';

type TCashierPayments = {
    provider: string;
    transaction_type: string;
};

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier?: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse>;
    cashierPayments?: ({ provider, transaction_type }: TCashierPayments) => Promise<any>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    cancelCryptoTransaction?: (transaction_id: string) => Promise<any>;
    send?: (args: any) => Promise<any>;
    subscribeCashierPayments?: (response: any) => Promise<any>;
    verifyEmail?: (email: string, withdrawal_type: string) => Promise<any>;
    wait?: (value: string) => Promise<any>;
};
