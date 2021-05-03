import debounce from 'lodash.debounce';
import { isEmptyObject } from '@deriv/shared';
import { WS } from 'Services/ws-methods';
import { createProposalRequests } from './proposal';

export const requestPreviewProposal = debounce((store, override = {}, onProposalResponse) => {
    const new_store = { ...store, ...override };
    const requests = createProposalRequests(new_store);
    const subscription_map = {};

    const onResponse = response => {
        if (response.error) return;

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
}, 700);
