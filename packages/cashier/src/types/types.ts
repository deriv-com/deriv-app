import {
    PingRequest,
    PingResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
    ExchangeRatesRequest,
    ExchangeRatesResponse,
    P2POrderInformationRequest,
    P2POrderInformationResponse,
    ServerStatusRequest,
    ServerStatusResponse,
    TermsAndConditionsApprovalRequest,
    TermsAndConditionsApprovalResponse,
    CashierInformationRequest,
    CashierInformationResponse,
    CryptocurrencyConfigurationsRequest,
    CryptocurrencyConfigurationsResponse,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
    PaymentAgentListRequest,
    PaymentAgentListResponse,
    PaymentAgentDetailsRequest,
    PaymentAgentDetailsResponse,
    PaymentAgentWithdrawRequest,
    PaymentAgentWithdrawResponse,
    TransferBetweenAccountsRequest,
    TransferBetweenAccountsResponse,
    BalanceRequest,
    BalanceResponse,
} from '@deriv/api-types';
import { KeysMatching } from './utils';

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
};

export type TSocketEndpointNames = keyof TSocketEndpoints;

export type TSocketSubscribableEndpointNames =
    | KeysMatching<TSocketEndpoints, { request: { subscribe?: number } }>
    | 'exchange_rates';

export type TSocketResponse<T extends TSocketEndpointNames> = TSocketEndpoints[T]['response'];

export type TSocketResponseData<T extends TSocketEndpointNames> = TSocketResponse<T>[T];

export type TSocketRequest<T extends TSocketEndpointNames> = TSocketEndpoints[T]['request'];

type TSocketRequestCleaned<T extends TSocketEndpointNames> = Omit<
    TSocketRequest<T>,
    (T extends KeysMatching<TSocketRequest<T>, 1> ? T : never) | 'passthrough' | 'req_id' | 'subscribe'
>;

export type TSocketRequestProps<T extends TSocketEndpointNames> = TSocketRequestCleaned<T> extends Record<string, never>
    ? never
    : TSocketRequestCleaned<T>;
