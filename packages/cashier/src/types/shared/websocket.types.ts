import {
    CashierInformationRequest,
    CashierInformationResponse,
    CryptoConfig,
    GetAccountSettingsResponse,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
} from '@deriv/api-types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse>;
    paymentAgentTransfer: (
        props: Omit<PaymentAgentTransferRequest, 'paymentagent_transfer'>
    ) => Promise<PaymentAgentTransferResponse>;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (
        args: Omit<CashierInformationRequest, 'cashier' | 'provider' | 'type'>
    ) => Promise<CashierInformationResponse>;
    send: (obj: any) => Promise<any>;
    storage: {
        getSettings: () => Promise<GetAccountSettingsResponse>;
    };
};

export type TWebSocket = { authorized: TWebSocketCall } & TWebSocketCall;
