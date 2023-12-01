import debounce from 'lodash.debounce';
import { requestPreviewProposal } from '../preview-proposal';
import { mockStore } from '@deriv/stores';
import { WS } from '@deriv/shared';

jest.mock('../proposal', () => ({
    createProposalRequests: jest.fn(() => ({ type1: {}, type2: {} })),
}));

jest.mock('lodash.debounce', () => {
    return jest.fn(fn => {
        return fn;
    });
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        subscribeProposal: jest.fn(),
        forget: jest.fn(),
    },
}));

describe('requestPreviewProposal', () => {
    const trade_store = mockStore({}).modules.trade;
    trade_store.trade_types = { CALL: 'Higher', PUT: 'Lower' };

    const onProposalResponseMock = jest.fn();

    it('calls createProposalRequests and WS.subscribeProposal when requests are not empty', () => {
        const requests = {
            proposal_1: {},
            proposal_2: {},
        };
        debounce(requestPreviewProposal, 700)(trade_store, onProposalResponseMock, {});
        expect(WS.subscribeProposal).toHaveBeenCalledTimes(Object.keys(requests).length);
    });
    it('should handle response and call onProposalResponse ', () => {
        WS.subscribeProposal.mockImplementation(
            (request: Record<string, unknown>, callback: (response: Record<string, unknown>) => void) => {
                const response = {
                    subscription: { id: '123' },
                };
                callback(response);
            }
        );
        debounce(requestPreviewProposal, 700)(trade_store, onProposalResponseMock, {});
        expect(onProposalResponseMock).toHaveBeenCalledWith(
            expect.objectContaining({
                subscription: { id: '123' },
            })
        );
    });
});
