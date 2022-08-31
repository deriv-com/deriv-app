export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier: (action: any, parameters: any) => Promise<any>;
};

export type TWebSocket = {
    send: (obj: any) => Promise<any>;
    authorized: TWebSocketCall;
};
