import {
    CashierInformationRequest,
    CashierInformationResponse,
    GetAccountSettingsResponse,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
    AccountStatusResponse,
    TransferBetweenAccountsRequest,
    TransferBetweenAccountsResponse,
    Balance,
    CryptoConfig,
} from '@deriv/api-types';
import { TMT5LoginAccount } from 'Types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TServiceTokenRequest = {
    service_token: number;
    service: string;
    referrer: string;
};

type TWebSocketCall = {
    send: (obj: any) => Promise<any>;
    wait: (value: string) => Promise<any>;
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
    storage: {
        getSettings: () => Promise<GetAccountSettingsResponse>;
        mt5LoginList: () => {
            mt5_login_list: Array<TMT5LoginAccount>;
        };
    };
    balanceAll: () => Promise<Balance>;
    mt5LoginList: () => {
        mt5_login_list: Array<TMT5LoginAccount>;
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: Array<TMT5LoginAccount>;
    };
    transferBetweenAccounts: (
        account_from: TransferBetweenAccountsRequest['account_from'],
        account_to: TransferBetweenAccountsRequest['account_to'],
        currency: TransferBetweenAccountsRequest['currency'],
        amount: TransferBetweenAccountsRequest['amount']
    ) => Promise<TransferBetweenAccountsResponse & { error: TServerError }>;
    getAccountStatus: () => Promise<AccountStatusResponse>;
    serviceToken: (req: TServiceTokenRequest) => Promise<any>;
};

type TAuthorizedCalls = 'cashier' | 'getAccountStatus' | 'transferBetweenAccounts';

export type TWebSocket = {
    authorized: Pick<TWebSocketCall, TAuthorizedCalls>;
} & Omit<TWebSocketCall, TAuthorizedCalls>;
