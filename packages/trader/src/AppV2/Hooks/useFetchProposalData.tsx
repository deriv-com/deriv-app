import React from 'react';

import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { useTraderStore } from 'Stores/useTraderStores';
import { TTradeStore } from 'Types';

import { useDtraderQuery } from './useDtraderQuery';

type TOnProposalResponse = TTradeStore['onProposalResponse'];
type TNewValues = {
    amount?: string | number;
    payout_per_point?: string | number;
    barrier_1?: string | number;
};
// TODO: We can reuse it in TakeProfitAndStopLoss and PayoutPerPoint components.
export const useFetchProposalData = ({
    trade_store,
    proposal_request_values,
    contract_type,
    contract_types,
    is_enabled,
}: {
    trade_store: ReturnType<typeof useTraderStore>;
    proposal_request_values: TNewValues;
    contract_type: string;
    contract_types: string[];
    is_enabled?: boolean;
}) => {
    const proposal_request = getProposalRequestObject({
        new_values: proposal_request_values,
        trade_store,
        trade_type: contract_type,
    });

    const entries = proposal_request_values ? Object.entries(proposal_request_values) : [];
    const query_key = [
        'proposal',
        ...entries.flat().join('-'),
        `${proposal_request_values?.amount ?? ''}`,
        JSON.stringify(proposal_request),
        contract_types.join('-'),
    ];

    return useDtraderQuery<Parameters<TOnProposalResponse>[0]>(query_key, proposal_request, {
        enabled: is_enabled,
    });
};
