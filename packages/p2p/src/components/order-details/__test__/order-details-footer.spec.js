import React from 'react';
import { useStores } from 'Stores';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderDetailsFooter from '../order-details-footer.jsx';

const mock_order_store = {
    is_buy_order: false,
    is_my_ad: false,
    is_sell_order: false,
    should_show_cancel_and_paid_button: false,
    should_show_complain_and_received_button: false,
    should_show_only_received_button: false,
    should_show_only_complain_button: false,
};
const mockFn = jest.fn();
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: {
            order_information: { ...mock_order_store },
            getAdvertiserInfo: jest.fn(() => mockFn()),
            getWebsiteStatus: jest.fn(),
        },
    })),
}));
const setShouldShowConfirmModalFn = jest.fn();
const setShouldShowComplainModalFn = jest.fn();

describe('<OrderDetailsFooter />', () => {
    it('Should show Cancel order and paid button', () => {
        useStores.mockImplementation(() => ({
            order_store: {
                order_information: { ...mock_order_store, should_show_cancel_and_paid_button: true },
                getAdvertiserInfo: jest.fn(() => mockFn()),
            },
        }));

        render(<OrderDetailsFooter />);

        expect(screen.getByRole('button', { name: 'Cancel order' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "I've paid" })).toBeInTheDocument();
    });

    it('cancel order when clicked', () => {
        render(<OrderDetailsFooter />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel order' }));
        expect(mockFn).toBeCalled();
    });

    it('should open confirm popup when clicked', () => {
        jest.spyOn(React, 'useState').mockImplementation(init => [init, setShouldShowConfirmModalFn]);
        render(<OrderDetailsFooter />);
        fireEvent.click(screen.getByRole('button', { name: "I've paid" }));
        expect(setShouldShowConfirmModalFn).toHaveBeenCalled();
    });

    it('should show complain and received button', () => {
        useStores.mockImplementation(() => ({
            order_store: {
                order_information: { ...mock_order_store, should_show_complain_and_received_button: true },
            },
        }));
        render(<OrderDetailsFooter />);
        expect(screen.getByRole('button', { name: 'Complain' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "I've received payment" })).toBeInTheDocument();
    });

    it('should open complain order modal when complain is clicked', () => {
        jest.spyOn(React, 'useState').mockImplementation(init => [init, setShouldShowComplainModalFn]);
        render(<OrderDetailsFooter />);
        fireEvent.click(screen.getByRole('button', { name: 'Complain' }));
        expect(setShouldShowComplainModalFn).toHaveBeenCalled();
    });

    it('received payment when clicked', () => {
        jest.spyOn(React, 'useState').mockImplementation(init => [init, setShouldShowConfirmModalFn]);
        render(<OrderDetailsFooter />);
        fireEvent.click(screen.getByRole('button', { name: "I've received payment" }));
        expect(setShouldShowConfirmModalFn).toHaveBeenCalled();
    });

    it('should show compain button', () => {
        useStores.mockImplementation(() => ({
            order_store: {
                order_information: { ...mock_order_store, should_show_only_complain_button: true },
            },
        }));
        render(<OrderDetailsFooter />);
        expect(screen.getByRole('button', { name: 'Complain' })).toBeInTheDocument();
    });

    it('when complain button is clicked', () => {
        jest.spyOn(React, 'useState').mockImplementation(init => [init, setShouldShowComplainModalFn]);
        render(<OrderDetailsFooter />);
        fireEvent.click(screen.getByRole('button', { name: 'Complain' }));
        expect(setShouldShowComplainModalFn).toHaveBeenCalled();
    });

    it('should show only received button', () => {
        useStores.mockImplementation(() => ({
            order_store: {
                order_information: { ...mock_order_store, should_show_only_received_button: true },
            },
        }));
        render(<OrderDetailsFooter />);
        expect(screen.getByRole('button', { name: "I've received payment" })).toBeInTheDocument();
    });

    it('when received button is clicked', () => {
        jest.spyOn(React, 'useState').mockImplementation(init => [init, setShouldShowConfirmModalFn]);
        render(<OrderDetailsFooter />);
        fireEvent.click(screen.getByRole('button', { name: "I've received payment" }));
        expect(setShouldShowConfirmModalFn).toHaveBeenCalled();
    });
    it('should render empty when state is false', () => {
        useStores.mockClear();
        render(<OrderDetailsFooter />);

        expect(OrderDetailsFooter.displayName).toBe('');
    });
});
