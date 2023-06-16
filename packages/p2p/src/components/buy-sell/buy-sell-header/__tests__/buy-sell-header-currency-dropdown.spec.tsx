import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores/index';
import BuySellHeaderCurrencyDropdown from '../buy-sell-header-currency-dropdown';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        local_currencies: [
            {
                display_name: 'IDR',
                is_default: true,
                text: 'IDR',
            },
            {
                display_name: 'INR',
                is_default: false,
                text: 'INR',
            },
        ],
    },
};

const mock_modal_manager = {
    isCurrentModal: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Components/buy-sell/buy-sell-header/buy-sell-header-currency-selector', () =>
    jest.fn(() => <div>BuySellHeaderCurrencySelector</div>)
);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('BuySellHeaderCurrencyDropdown', () => {
    it('should render the component', () => {
        render(<BuySellHeaderCurrencyDropdown />);

        expect(screen.getByTestId('dti_dropdown_display')).toBeInTheDocument();
    });
    it('should show the currency list upon clicking the dropdown in desktop', async () => {
        render(<BuySellHeaderCurrencyDropdown />);

        const dropdown = screen.getByTestId('dti_dropdown_display');
        userEvent.click(dropdown);

        await waitFor(() => {
            expect(screen.getByText('BuySellHeaderCurrencySelector')).toBeInTheDocument();
        });
    });
    it('should show the modal upon clicking the dropdown in responsive', async () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<BuySellHeaderCurrencyDropdown />);

        const dropdown = screen.getByTestId('dti_dropdown_display');
        userEvent.click(dropdown);

        await waitFor(() => {
            expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CurrencySelectorModal' });
        });
    });
});
