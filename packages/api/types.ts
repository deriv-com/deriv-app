import type {
    BalanceRequest,
    BalanceResponse,
    CashierInformationRequest,
    CashierInformationResponse,
    CryptocurrencyConfigurationsRequest,
    CryptocurrencyConfigurationsResponse,
    ExchangeRatesRequest,
    ExchangeRatesResponse,
    NewVirtualMoneyAccountRequest,
    NewVirtualMoneyAccountResponse,
    P2POrderInformationRequest,
    P2POrderInformationResponse,
    PaymentAgentDetailsRequest,
    PaymentAgentDetailsResponse,
    PaymentAgentListRequest,
    PaymentAgentListResponse,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
    PaymentAgentWithdrawRequest,
    PaymentAgentWithdrawResponse,
    PingRequest,
    PingResponse,
    ServerStatusRequest,
    ServerStatusResponse,
    TermsAndConditionsApprovalRequest,
    TermsAndConditionsApprovalResponse,
    TicksStreamRequest,
    TicksStreamResponse,
    TransferBetweenAccountsRequest,
    TransferBetweenAccountsResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
} from '@deriv/api-types';

export type TSocketEndpoints = {
    ping: {
        request: PingRequest;
        response: PingResponse;
    };
    verify_email: {
        request: VerifyEmailRequest;
        response: VerifyEmailResponse;
    };
    exchange_rates: {
        request: ExchangeRatesRequest;
        response: ExchangeRatesResponse;
    };
    p2p_order_info: {
        request: P2POrderInformationRequest;
        response: P2POrderInformationResponse;
    };
    website_status: {
        request: ServerStatusRequest;
        response: ServerStatusResponse;
    };
    tnc_approval: {
        request: TermsAndConditionsApprovalRequest;
        response: TermsAndConditionsApprovalResponse;
    };
    cashier: {
        request: CashierInformationRequest;
        response: CashierInformationResponse;
    };
    crypto_config: {
        request: CryptocurrencyConfigurationsRequest;
        response: CryptocurrencyConfigurationsResponse;
    };
    paymentagent_transfer: {
        request: PaymentAgentTransferRequest;
        response: PaymentAgentTransferResponse;
    };
    paymentagent_list: {
        request: PaymentAgentListRequest;
        response: PaymentAgentListResponse;
    };
    paymentagent_details: {
        request: PaymentAgentDetailsRequest;
        response: PaymentAgentDetailsResponse;
    };
    paymentagent_withdraw: {
        request: PaymentAgentWithdrawRequest;
        response: PaymentAgentWithdrawResponse;
    };
    transfer_between_accounts: {
        request: TransferBetweenAccountsRequest;
        response: TransferBetweenAccountsResponse;
    };
    balance: {
        request: BalanceRequest;
        response: BalanceResponse;
    };
    ticks: {
        request: TicksStreamRequest;
        response: TicksStreamResponse;
    };
    new_account_virtual: {
        request: NewVirtualMoneyAccountRequest;
        response: NewVirtualMoneyAccountResponse;
    };
};

export type TSocketEndpointNames = keyof TSocketEndpoints;

export type TSocketSubscribableEndpointNames =
    | KeysMatching<TSocketEndpoints, { request: { subscribe?: number } }>
    | 'exchange_rates';

export type TSocketResponse<T extends TSocketEndpointNames> = TSocketEndpoints[T]['response'];

export type TSocketResponseData<T extends TSocketEndpointNames> = TSocketResponse<T>[T extends 'ticks' ? 'tick' : T];

export type TSocketRequest<T extends TSocketEndpointNames> = TSocketEndpoints[T]['request'];

type TSocketRequestCleaned<T extends TSocketEndpointNames> = Omit<
    TSocketRequest<T>,
    (T extends KeysMatching<TSocketRequest<T>, 1> ? T : never) | 'passthrough' | 'req_id' | 'subscribe'
>;

export type TSocketRequestProps<T extends TSocketEndpointNames> = TSocketRequestCleaned<T> extends Record<string, never>
    ? never
    : TSocketRequestCleaned<T>;

export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
