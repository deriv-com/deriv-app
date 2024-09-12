import debounce from 'lodash.debounce';
import { isEmptyObject, WS } from '@deriv/shared';
import { createProposalRequests } from './proposal';
import { PriceProposalRequest, PriceProposalResponse } from '@deriv/api-types';
import { TTradeStore } from 'Types';
import { ProposalResponse } from '../trade-store';

type TResponse<Req, Res extends { [key: string]: unknown }, K extends string> = Res & {
    echo_req: Req;
    error?: {
        code: string;
        message: string;
        details?: Res[K] & { field: string };
    };
};

export const previewProposal = (
    store: TTradeStore,
    onProposalResponse: TTradeStore['onProposalResponse'],
    override = {},
    should_show_error = false
) => {
    const new_store = { ...store, ...override };
    const requests = createProposalRequests(new_store as Parameters<typeof createProposalRequests>[0]);
    const subscription_map: { [key: string]: boolean } = {};

    const onResponse = (response: TResponse<PriceProposalRequest, ProposalResponse, 'proposal'>) => {
        if (!should_show_error && (response.error || !response.subscription)) return;

        if (response.subscription) {
            subscription_map[response.subscription.id] = true;
        }
        onProposalResponse(response);
    };

    if (!isEmptyObject(requests)) {
        const proposal_requests = requests;

        Object.keys(proposal_requests).forEach(type => {
            WS.subscribeProposal(proposal_requests[type], onResponse);
        });
    }

    return () => {
        Object.keys(subscription_map).forEach(id => {
            WS.forget(id);
            delete subscription_map[id];
        });
    };
};

export const requestPreviewProposal = debounce(previewProposal, 700);
