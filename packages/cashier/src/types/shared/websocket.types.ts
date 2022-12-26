import { CashierInformationRequest, CashierInformationResponse, CryptoConfig } from '@deriv/api-types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
    fields?: string[];
};

type TServiceTokenRequest = {
    service_token: number;
    service: string;
    referrer: string;
};

type TServiceTokenResponse = {
    error: TServerError;
    service_token: {
        banxa: {
            url: string;
        };
    };
};

type TWebSocketCall = {
    cashier: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (
        args: Omit<CashierInformationRequest, 'cashier' | 'provider' | 'type'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    send: (obj: unknown) => Promise<unknown>;
    serviceToken: (req: TServiceTokenRequest) => Promise<TServiceTokenResponse>;
};
