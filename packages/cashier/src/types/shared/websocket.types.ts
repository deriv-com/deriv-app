import { TMt5LoginList, TTradingPlatformAccountsList, TTransferBetweenAccountsResponse } from 'Types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier: (action: any, parameters: any) => Promise<any>;
    transferBetweenAccounts: (
        from_value?: string,
        to_value?: string,
        currency?: string,
        amount?: string
    ) => Promise<TTransferBetweenAccountsResponse>;
    getAccountStatus: () => {
        error: TServerError;
        get_account_status: string;
    };
};

export type TWebSocket = {
    send: (obj: any) => Promise<any>;
    authorized: TWebSocketCall;
    wait: (status: string) => Promise<void>;
    storage: {
        mt5LoginList: () => Promise<{
            mt5_login_list: TMt5LoginList;
        }>;
    };
    tradingPlatformAccountsList: (platform: string) => Promise<TTradingPlatformAccountsList>;
};
