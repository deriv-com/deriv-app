import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterModalHeader from '../filter-modal-header';

const mock_store = {
    buy_sell_store: {
        show_filter_payment_methods: false,
    },
};

const mock_props = {
    pageHeaderReturnFn: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<FilterModalHeader />', () => {
    it('should render the component', () => {
        render(<FilterModalHeader {...mock_props} />);
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });
    it('should render the component with payment methods', () => {
        mock_store.buy_sell_store.show_filter_payment_methods = true;
        render(<FilterModalHeader {...mock_props} />);
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
    });
    it('should handle clicking return', () => {
        render(<FilterModalHeader {...mock_props} />);
        const return_button = screen.getByTestId('dt_page_return_icon');
        userEvent.click(return_button);
        expect(mock_props.pageHeaderReturnFn).toHaveBeenCalled();
    });
});
