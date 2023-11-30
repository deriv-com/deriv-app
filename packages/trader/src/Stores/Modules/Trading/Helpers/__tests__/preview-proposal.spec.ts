// import { mockStore } from '@deriv/stores';
// import { requestPreviewProposal } from '../preview-proposal';
// import { WS } from '@deriv/shared';
import debounce from 'lodash.debounce';
import { WS, isEmptyObject } from '@deriv/shared';
import { PriceProposalRequest, PriceProposalResponse } from '@deriv/api-types';
import { TTradeStore } from 'Types';
import { requestPreviewProposal } from '../preview-proposal';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    isEmptyObject: jest.fn(() => false),
    WS: {
        subscribeProposal: jest.fn(),
        forget: jest.fn(),
    },
}));

jest.mock('../proposal', () => ({
    createProposalRequests: jest.fn(() => ({ type1: {}, type2: {} })),
}));

describe('requestPreviewProposal', () => {
    let store: TTradeStore,
        onProposalResponse: TTradeStore['onProposalResponse'],
        unsubscribe: (() => void) | undefined;

    beforeEach(() => {
        store = mockStore({}).modules.trade;
        onProposalResponse = jest.fn();
        jest.useFakeTimers();
        unsubscribe = requestPreviewProposal(store, onProposalResponse);
    });

    it('should subscribe to proposals and call onProposalResponse', () => {
        // Trigger the function multiple times within the debounce interval
        requestPreviewProposal(store, onProposalResponse);
        requestPreviewProposal(store, onProposalResponse);

        // Advance time to exceed the debounce interval
        jest.advanceTimersByTime(700);

        expect(WS.subscribeProposal).toHaveBeenCalledTimes(2);
        expect(onProposalResponse).toHaveBeenCalledTimes(2);
    });

    it('should unsubscribe from proposals when unsubscribed', () => {
        unsubscribe?.();

        expect(WS.forget).toHaveBeenCalled();
    });
});
// jest.mock('lodash.debounce', () => {
//     return jest.fn((wait, fn) => {
//         let timeout: NodeJS.Timeout;

//         const debouncedFn = (...args: any[]) => {
//             clearTimeout(timeout);

//             timeout = setTimeout(() => {
//                 fn(...args);
//             }, wait);
//         };

//         return debouncedFn;
//     });
// });

// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     WS: {
//         subscribeProposal: jest.fn(),
//         forget: jest.fn(),
//     },
// }));

// describe('requestPreviewProposal', () => {
//     const trade_store = mockStore({}).modules.trade;
//     trade_store.trade_types = { CALL: 'Higher', PUT: 'Lower' };

//     const onProposalResponseMock = jest.fn();

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('calls createProposalRequests and WS.subscribeProposal when requests are not empty', () => {
//         const requests = {
//             proposal_1: {},
//             proposal_2: {},
//         };
//         jest.useFakeTimers();
//         const unsubscribe = requestPreviewProposal(trade_store, onProposalResponseMock, {});
//         jest.advanceTimersByTime(800);
//         expect(WS.subscribeProposal).toHaveBeenCalledTimes(Object.keys(requests).length);
//         // setTimeout(() => {
//         //     requestPreviewProposal(trade_store, onProposalResponseMock, {});
//         // }, 1000);

//         unsubscribe?.();
//     });
// });
