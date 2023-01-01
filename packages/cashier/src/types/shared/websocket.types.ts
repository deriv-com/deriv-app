import {
    AccountStatusResponse,
    Balance,
    CashierInformationRequest,
    CashierInformationResponse,
    CryptoConfig,
    DetailsOfEachMT5Loginid,
    TransferBetweenAccountsResponse,
} from '@deriv/api-types';

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
    getAccountStatus: () => Promise<AccountStatusResponse>;
    transferBetweenAccounts: (
        account_from?: string,
        account_to?: string,
        currency?: string,
        amount?: number
    ) => Promise<TransferBetweenAccountsResponse & { error: TServerError }>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    balanceAll: () => Promise<Balance>;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (
        args: Omit<CashierInformationRequest, 'cashier' | 'provider' | 'type'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    mt5LoginList: () => {
        mt5_login_list: DetailsOfEachMT5Loginid[];
    };
    send: (obj: unknown) => Promise<unknown>;
    serviceToken: (req: TServiceTokenRequest) => Promise<TServiceTokenResponse>;
    storage: {
        mt5LoginList: () => {
            mt5_login_list: DetailsOfEachMT5Loginid[];
        };
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: (DetailsOfEachMT5Loginid & { account_id: string })[];
    };
    wait: (value: string) => Promise<unknown>;
};
