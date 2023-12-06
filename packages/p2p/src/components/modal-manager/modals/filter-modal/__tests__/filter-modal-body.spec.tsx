import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import FilterModalBody from '../filter-modal-body';

const mock_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        setShowFilterPaymentMethods: jest.fn(),
        setShouldUseClientLimits: jest.fn(),
        show_filter_payment_methods: false,
        should_use_client_limits: false,
    },
    my_profile_store: {
        payment_methods_list_items: [
            {
                text: 'Skrill',
                value: 'skrill',
            },
        ],
    },
};

const mock_props = {
    handleToggle: jest.fn(),
    onChange: jest.fn(),
    selected_methods: ['skrill'],
    selected_methods_text: ['Skrill'],
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

jest.mock('../filter-modal-result', () => jest.fn(() => <div>FilterModalResult</div>));
jest.mock('../filter-modal-search', () => jest.fn(() => <div>FilterModalSearch</div>));

describe('<FilterModalBody />', () => {
    it('should render the modal content', () => {
        render(<FilterModalBody {...mock_props} />);
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Matching ads')).toBeInTheDocument();
    });
    it('should handle onclick for payment methods section', () => {
        render(<FilterModalBody {...mock_props} />);
        userEvent.click(screen.getByText('Payment methods'));
        expect(mock_store_values.buy_sell_store.setShowFilterPaymentMethods).toHaveBeenCalledWith(true);
    });
    it('should handle toggle button click', () => {
        render(<FilterModalBody {...mock_props} />);
        userEvent.click(screen.getByRole('checkbox', { name: 'matching_ads_toggler' }));
        expect(mock_props.handleToggle).toBeCalled();
    });
    it('should show the result section and search section when payment method section was already clicked', () => {
        mock_store_values.buy_sell_store.show_filter_payment_methods = true;
        render(<FilterModalBody {...mock_props} />);
        expect(screen.getByText('FilterModalResult')).toBeInTheDocument();
        expect(screen.getByText('FilterModalSearch')).toBeInTheDocument();
    });
});
