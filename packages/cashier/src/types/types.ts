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
};

export type TSocketEndpointNames = keyof TSocketEndpoints;
export type TSocketSubscribableEndpointNames =
    | KeysMatching<TSocketEndpoints, { request: { subscribe?: number } }>
    | 'exchange_rates';
export type TSocketResponse<T extends TSocketEndpointNames> = TSocketEndpoints[T]['response'];
export type TSocketResponseData<T extends TSocketEndpointNames> = TSocketResponse<T>[T];
export type TSocketResponseSubscriptionInformation<T extends TSocketEndpointNames> = TSocketResponse<T>['subscription'];
export type TSocketRequest<T extends TSocketEndpointNames> = TSocketEndpoints[T]['request'];
type TSocketRequestCleaned<T extends TSocketEndpointNames> = Omit<
    TSocketRequest<T>,
    (T extends KeysMatching<TSocketRequest<T>, 1> ? T : never) | 'passthrough' | 'req_id'
>;
export type TSocketRequestProps<T extends TSocketEndpointNames> = TSocketRequestCleaned<T> extends Record<string, never>
    ? never
    : TSocketRequestCleaned<T>;
