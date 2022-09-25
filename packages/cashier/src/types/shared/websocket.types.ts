import {
    CashierInformationRequest,
    CashierInformationResponse,
    ExchangeRatesRequest,
    ExchangeRatesResponse,
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
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    send: (args: ExchangeRatesRequest) => Promise<ExchangeRatesResponse>;
    wait: (value: string) => Promise<any>;
};
