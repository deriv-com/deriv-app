import debounce from 'lodash.debounce';
import { isEmptyObject, WS } from '@deriv/shared';
import { createProposalRequests } from './proposal';
import { PriceProposalResponse } from '@deriv/api-types';
import { TTradeStore } from 'Types';

export const requestPreviewProposal = debounce(
    (store: TTradeStore, override = {}, onProposalResponse: (response: PriceProposalResponse) => void) => {
        const new_store = { ...store, ...override };
        const requests = createProposalRequests(new_store);
        const subscription_map: { [key: string]: boolean } = {};

        const onResponse = (response: PriceProposalResponse) => {
            if (response.error || !response.subscription) return;

            subscription_map[response.subscription.id] = true;
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
    },
    700
);
