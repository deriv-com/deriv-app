import { DetailsOfEachMT5Loginid, Balance } from '@deriv/api-types';

// TODO: this type can be removed when account_id is added to the @deriv/api-types
type TMT5LoginAccount = DetailsOfEachMT5Loginid & {
    account_id?: string;
};

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
        mt5_login_list: Array<TMT5LoginAccount>;
    };
    send: (obj: any) => Promise<any>;
    storage: {
        mt5LoginList: () => {
            mt5_login_list: Array<TMT5LoginAccount>;
        };
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: Array<TMT5LoginAccount>;
    };
    wait: (value: string) => Promise<any>;
};
