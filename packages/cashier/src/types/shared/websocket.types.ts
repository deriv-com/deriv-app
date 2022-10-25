import {
    AccountStatusResponse,
    Balance,
    CashierInformationRequest,
    CashierInformationResponse,
    CryptoConfig,
    GetAccountSettingsResponse,
    PaymentAgentDetailsResponse,
    PaymentAgentTransferResponse,
    PaymentAgentWithdrawResponse,
    TransferBetweenAccountsResponse,
    PaymentAgentWithdrawRequest,
} from '@deriv/api-types';
import { TExtendedPaymentAgentListResponse, TMT5LoginAccount, TPaymentAgentTransferRequest } from 'Types';

type TCashierPayments = {
    provider: string;
    transaction_type: string;
};

export type TServerError = {
    code: string;
    details?: { [key: string]: string };
    message: string;
};

type TPassthrough = {
    [k: string]: unknown;
};

type TStorage = {
    getSettings: () => Promise<GetAccountSettingsResponse>;
};

type TServiceTokenRequest = {
    service_token: number;
    service: string;
    referrer: string;
};

type TCancelCryptoTransaction = {
    error: TServerError;
};

type TPaymentAgentWithdrawRequest = Omit<PaymentAgentWithdrawRequest, 'paymentagent_loginid'> & { loginid: string };

type TWebSocketCall = {
    cashier: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    cashierPayments?: ({ provider, transaction_type }: TCashierPayments) => Promise<any>;
    getAccountStatus: () => Promise<AccountStatusResponse>;
    p2pAdvertiserInfo?: () => Promise<any>;
    paymentAgentDetails: (passthrough?: TPassthrough, req_id?: number) => Promise<PaymentAgentDetailsResponse>;
    paymentAgentList: (residence: string, currency: string) => Promise<TExtendedPaymentAgentListResponse>;
    paymentAgentTransfer: ({
        amount,
        currency,
        description,
        transfer_to,
        dry_run,
    }: TPaymentAgentTransferRequest) => Promise<PaymentAgentTransferResponse>;
    paymentAgentWithdraw: ({
        loginid,
        currency,
        amount,
        verification_code,
        dry_run,
    }: TPaymentAgentWithdrawRequest) => Promise<PaymentAgentWithdrawResponse>;
    send?: (obj: any) => Promise<any>;
    storage: TStorage;
    transferBetweenAccounts: (
        account_from?: string,
        account_to?: string,
        currency?: string,
        amount?: number
    ) => Promise<TransferBetweenAccountsResponse & { error: TServerError }>;
};

export type TWebSocket = {
    allPaymentAgentList: (residence: string) => Promise<TExtendedPaymentAgentListResponse>;
    authorized: TWebSocketCall;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (
        args: Omit<CashierInformationRequest, 'cashier' | 'provider' | 'type'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    balanceAll: () => Promise<Balance>;
    cancelCryptoTransaction?: (transaction_id: string) => Promise<TCancelCryptoTransaction>;
    mt5LoginList: () => { mt5_login_list: Array<TMT5LoginAccount> };
    send: (obj: any) => Promise<any>;
    serviceToken: (req: TServiceTokenRequest) => Promise<any>;
    storage: { mt5LoginList: () => { mt5_login_list: Array<TMT5LoginAccount> } };
    subscribeCashierPayments?: (response: any) => Promise<any>;
    tradingPlatformAccountsList: (platform: string) => { trading_platform_accounts: Array<TMT5LoginAccount> };
    verifyEmail?: (email: string, withdrawal_type: string) => Promise<any>;
    wait: (value: string) => Promise<any>;
};
