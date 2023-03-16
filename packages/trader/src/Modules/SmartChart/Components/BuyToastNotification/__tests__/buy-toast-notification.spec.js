import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyToastNotification from '../../buy-toast-notification';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('BuyToastNotification component', () => {
    const mockActionChangeToastbox = jest.fn();
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

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render the notification ', () => {
        const { container } = render(
            <BuyToastNotification
                action_toastbox={mockActionToastbox.key}
                actionChangeToastbox={mockActionChangeToastbox}
            />
        );
        const portalElement = container.querySelector('#popup_root');
        expect(portalElement).toBeDefined();
    });

    it('should call actionChangeToastbox after 4 seconds', () => {
        render(
            <BuyToastNotification
                action_toastbox={mockActionToastbox.key}
                actionChangeToastbox={mockActionChangeToastbox}
            />
        );

        jest.advanceTimersByTime(4000);
        expect(mockActionChangeToastbox).toHaveBeenCalled();
    });

    it('should not render anything if the portal_id or action_toastbox is not present', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<BuyToastNotification actionChangeToastbox={mockActionChangeToastbox} />)).toThrow();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
