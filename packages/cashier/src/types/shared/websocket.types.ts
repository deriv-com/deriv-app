import { Authorize, DetailsOfEachMT5Loginid, Balance } from '@deriv/api-types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier: (action: any, parameters: any) => Promise<any>;
    getAccountStatus: () => Promise<any>;
    transferBetweenAccounts: (
        account_from?: string,
        account_to?: string,
        currency?: string,
        amount?: number
    ) => Promise<any>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    balanceAll: () => Promise<Balance>;
    mt5LoginList: () => {
        mt5_login_list: DetailsOfEachMT5Loginid[];
    };
    send: (obj: any) => Promise<any>;
    storage: {
        mt5LoginList: () => {
            mt5_login_list: DetailsOfEachMT5Loginid[];
        };
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: DetailsOfEachMT5Loginid[];
    };
    wait: (value: string) => Promise<any>;
};
