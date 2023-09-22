import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import FilterModalResult from '../filter-modal-result';
import userEvent from '@testing-library/user-event';

const mock_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        is_filter_modal_loading: false,
    },
    my_profile_store: {
        payment_methods_list_items: [
            {
                text: 'Skrill',
                value: 'skrill',
            },
            {
                value: 'bank',
                text: 'Bank',
            },
            {
                value: 'upi',
                text: 'UPI',
            },
        ],
        search_results: [],
        search_term: '',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

const mock_props = {
    onChange: jest.fn(),
    selected_methods: ['skrill'],
};

describe('<FilterModalResult />', () => {
    it('should render the component with the passed props', () => {
        render(<FilterModalResult {...mock_props} />);
        expect(screen.getByText('Skrill')).toBeInTheDocument();
        expect(screen.getByText('Bank')).toBeInTheDocument();
    });
    it('should handle checkbox selection', () => {
        render(<FilterModalResult {...mock_props} />);
        const checkbox = screen.getByRole('checkbox', { name: 'Skrill' });
        userEvent.click(checkbox);
        expect(mock_props.onChange).toHaveBeenCalledWith({ text: 'Skrill', value: 'skrill' });
    });
    it('should show no results if search term is present and no results are found', () => {
        mock_store_values.my_profile_store.search_term = 'test';
        render(<FilterModalResult {...mock_props} />);
        expect(screen.getByText('No results for "test".')).toBeInTheDocument();
    });
    it('should show the search results if search term is present and results are found', () => {
        mock_store_values.my_profile_store.search_term = 'skrill';
        mock_store_values.my_profile_store.search_results = [{ text: 'Skrill', value: 'skrill' }];
        render(<FilterModalResult {...mock_props} />);
        expect(screen.getByText('Skrill')).toBeInTheDocument();
    });
    it('should handle selection of search results', () => {
        mock_store_values.my_profile_store.search_term = 'skrill';
        mock_store_values.my_profile_store.search_results = [{ text: 'Skrill', value: 'skrill' }];
        render(<FilterModalResult {...mock_props} />);
        expect(screen.getByText('Skrill')).toBeInTheDocument();
        const checkbox = screen.getByRole('checkbox', { name: 'Skrill' });
        userEvent.click(checkbox);
        expect(mock_props.onChange).toHaveBeenCalledWith({ text: 'Skrill', value: 'skrill' });
    });
    it('should show the Loading indicator when in loading state', () => {
        mock_store_values.buy_sell_store.is_filter_modal_loading = true;
        render(<FilterModalResult {...mock_props} />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
