import {
    Balance,
    CashierInformationRequest,
    CashierInformationResponse,
    AccountStatusResponse,
    TransferBetweenAccountsResponse,
} from '@deriv/api-types';
import { TMT5LoginAccount } from 'Types';

type TCashierPayments = {
    provider: string;
    transaction_type: string;
};

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
    cashier?: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse>;
    cashierPayments?: ({ provider, transaction_type }: TCashierPayments) => Promise<any>;
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
    cancelCryptoTransaction?: (transaction_id: string) => Promise<any>;
    subscribeCashierPayments?: (response: any) => Promise<any>;
    verifyEmail?: (email: string, withdrawal_type: string) => Promise<any>;
    wait?: (value: string) => Promise<any>;
    balanceAll: () => Promise<Balance>;
    mt5LoginList: () => {
        mt5_login_list: Array<TMT5LoginAccount>;
    };
    send: (obj: any) => Promise<any>;
    serviceToken: (req: TServiceTokenRequest) => Promise<any>;
    storage: {
        mt5LoginList: () => {
            mt5_login_list: Array<TMT5LoginAccount>;
        };
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: Array<TMT5LoginAccount>;
    };
};
