import type {
    AccountStatusResponse,
    Balance,
    CashierInformationRequest,
    CashierInformationResponse,
    CryptoConfig,
    GetAccountSettingsResponse,
    DetailsOfEachMT5Loginid,
    P2PAdvertInfo,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
    TransferBetweenAccountsResponse,
    PaymentAgentWithdrawRequest,
    PaymentAgentWithdrawResponse,
    PaymentAgentDetailsResponse,
    PaymentAgentListResponse,
} from '@deriv/api-types';
import type { TSocketEndpointNames, TSocketResponse, TSocketRequestPayload } from '@deriv/api/types';

export type TAuthorizedSend = {
    error?: TServerError;
    p2p_order_list?: { list: P2PAdvertInfo[] };
};

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
    fields?: string[];
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

type TServiceTokenResponse = {
    error: TServerError;
    service_token: {
        banxa: {
            url: string;
        };
    };
};

export type TPaymentAgentTransferRequest = Omit<
    PaymentAgentTransferRequest,
    'paymentagent_transfer' | 'passthrough' | 'req_id'
>;

export type TPaymentAgentWithdrawRequest = Omit<
    PaymentAgentWithdrawRequest,
    'paymentagent_withdraw' | 'passthrough' | 'req_id' | 'paymentagent_loginid'
> & { loginid: string };

type TWebSocketCall = {
    cashier: (
        action: string,
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    cashierPayments?: (
        request?: TSocketRequestPayload<'cashier_payments'>['payload']
    ) => Promise<TSocketResponse<'cashier_payments'>>;
    getAccountStatus: () => Promise<AccountStatusResponse>;
    paymentAgentTransfer: (
        request: TPaymentAgentTransferRequest
    ) => Promise<PaymentAgentTransferResponse & { error: TServerError }>;
    send?: (obj: unknown) => Promise<TAuthorizedSend>;
    storage: TStorage;
    transferBetweenAccounts: (
        account_from?: string,
        account_to?: string,
        currency?: string,
        amount?: number
    ) => Promise<TransferBetweenAccountsResponse & { error: TServerError }>;
    paymentAgentDetails: (passthrough?: TPassthrough, req_id?: number) => Promise<PaymentAgentDetailsResponse>;
    paymentAgentList: (residence: string, currency: string) => Promise<PaymentAgentListResponse>;
    paymentAgentWithdraw: (request: TPaymentAgentWithdrawRequest) => Promise<PaymentAgentWithdrawResponse>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    balanceAll: () => Promise<Balance>;
    cancelCryptoTransaction?: (transaction_id: string) => Promise<{ error: TServerError }>;
    cryptoConfig: () => Promise<{ crypto_config: CryptoConfig }>;
    cryptoWithdraw: (
        args: Omit<CashierInformationRequest, 'cashier' | 'provider' | 'type'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    mt5LoginList: () => Promise<{
        mt5_login_list: DetailsOfEachMT5Loginid[];
    }>;
    send: (obj: unknown) => Promise<{ error: TServerError; exchange_rates: { rates: { [k: string]: string } } }>;
    serviceToken: (req: TServiceTokenRequest) => Promise<TServiceTokenResponse>;
    subscribeCashierPayments?: (callback: (response: TSocketResponse<'cashier_payments'>) => void) => Promise<void>;
    storage: {
        mt5LoginList: () => Promise<{
            mt5_login_list: DetailsOfEachMT5Loginid[];
        }>;
    };
    tradingPlatformAccountsList: (platform: string) => Promise<{
        trading_platform_accounts: (DetailsOfEachMT5Loginid & { account_id: string })[];
    }>;
    wait: <T extends TSocketEndpointNames>(value: T) => Promise<TSocketResponse<T>>;
};
