import { useTraderStore } from 'Stores/useTraderStores';

export type TTextValueStrings = {
    text: string;
    value: string;
};

export type TProposalTypeInfo = TTradeStore['proposal_info'][string];

export type TError = {
    error?: {
        code?: string;
        details?: {
            field?: string;
        };
        message?: string;
    };
};

export type TTradeStore = ReturnType<typeof useTraderStore>;
