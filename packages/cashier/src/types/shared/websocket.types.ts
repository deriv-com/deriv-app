/* eslint-disable @typescript-eslint/no-explicit-any */
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
    cashier: (action: unknown, parameters: unknown) => Promise<any>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    send: (obj: unknown) => Promise<unknown>;
    serviceToken: (req: TServiceTokenRequest) => Promise<TServiceTokenResponse>;
};
