import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import FilterModalFooter from '../filter-modal-footer';

const mock_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        show_filter_payment_methods: false,
    },
};

const mock_props = {
    class_name: '',
    has_made_changes: false,
    has_selected_payment_methods: false,
    onClickApply: jest.fn(),
    onClickClearPaymentMethods: jest.fn(),
    onClickConfirmPaymentMethods: jest.fn(),
    onClickReset: jest.fn(),
    selected_methods: ['skrill'],
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

describe('<FilterModalFooter />', () => {
    it('should render the component', () => {
        render(<FilterModalFooter {...mock_props} />);
        expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });
    it('should handle reset button click', () => {
        render(<FilterModalFooter {...mock_props} />);
        userEvent.click(screen.getByRole('button', { name: 'Reset' }));
        expect(mock_props.onClickReset).toHaveBeenCalledTimes(1);
    });
    it('should handle apply button click', () => {
        const new_props = { ...mock_props, has_made_changes: true };

        render(<FilterModalFooter {...new_props} />);
        userEvent.click(screen.getByRole('button', { name: 'Apply' }));
        expect(mock_props.onClickApply).toHaveBeenCalledTimes(1);
    });
    it('should handle clear button click', () => {
        mock_store_values.buy_sell_store.show_filter_payment_methods = true;

        render(<FilterModalFooter {...mock_props} />);
        userEvent.click(screen.getByRole('button', { name: 'Clear' }));
        expect(mock_props.onClickClearPaymentMethods).toHaveBeenCalledTimes(1);
    });
    it('should handle confirm button click', () => {
        mock_store_values.buy_sell_store.show_filter_payment_methods = true;
        const new_props = { ...mock_props, has_selected_payment_methods: true };

        render(<FilterModalFooter {...new_props} />);
        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        expect(mock_props.onClickConfirmPaymentMethods).toHaveBeenCalledTimes(1);
    });
});
