import {
    PriceProposalOpenContractsRequest,
    PriceProposalOpenContractsResponse,
    TicksStreamRequest,
    TicksStreamResponse,
    UpdateContractRequest,
    UpdateContractResponse,
} from '@deriv/api-types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
    fields?: string[];
};

type TWebSocketCall = {
    subscribeProposalOpenContract: (
        contract_id: PriceProposalOpenContractsRequest['contract_id'],
        callback: (response: PriceProposalOpenContractsResponse) => void
    ) => void;
    send?: (req?: Record<string, unknown>) => Promise<{ error?: TServerError & Record<string, unknown> }>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    storage: {
        send?: (req?: Record<string, unknown>) => Promise<{ error?: TServerError & Record<string, unknown> }>;
    };
    contractUpdate: (
        contract_id: UpdateContractRequest['contract_id'],
        limit_order: UpdateContractRequest['limit_order']
    ) => Promise<{ error?: TServerError } & UpdateContractResponse>;
    subscribeTicksHistory: (
        req: TicksStreamRequest,
        callback: () => void
    ) => Promise<{ error?: TServerError } & TicksStreamResponse>;
    forgetStream: (stream_id: string) => void;
    activeSymbols: (mode?: 'string') => void;

    send?: (req?: Record<string, unknown>) => Promise<{ error?: TServerError & Record<string, unknown> }>;
};
