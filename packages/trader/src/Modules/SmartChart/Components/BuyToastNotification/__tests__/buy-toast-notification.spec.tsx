import React from 'react';
import { render } from '@testing-library/react';
import BuyToastNotification from '../../buy-toast-notification';
import { mockStore, StoreProvider } from '@deriv/stores';

describe('BuyToastNotification component', () => {
    const mockActionToastbox = {
        buy_price: '100',
        currency: 'USD',
        contract_type: 'rise_fall',
        list: [
            { contract_category: 'up_down', contract_types: [{ text: 'Rise/Fall', value: 'rise_fall' }] },
            { contract_category: 'high_low', contract_types: [{ text: 'Higher/Lower', value: 'higher_lower' }] },
        ],
        key: true,
    };

    const mock = mockStore({
        modules: {
            trade: {
                contract_purchase_toast_box: mockActionToastbox,
                clearContractPurchaseToastBox: jest.fn(),
            },
        },
    });

    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'popup_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render the notification ', () => {
        render(<BuyToastNotification />, {
            wrapper: ({ children }) => <StoreProvider store={mock}>{children}</StoreProvider>,
        });

        expect(modal_root_el).toBeInTheDocument();
    });

    it('should call clearContractPurchaseToastBox after 4 seconds', () => {
        render(<BuyToastNotification />, {
            wrapper: ({ children }) => <StoreProvider store={mock}>{children}</StoreProvider>,
        });

        jest.advanceTimersByTime(4000);
        expect(mock.modules.trade.clearContractPurchaseToastBox).toHaveBeenCalled();
    });
});
