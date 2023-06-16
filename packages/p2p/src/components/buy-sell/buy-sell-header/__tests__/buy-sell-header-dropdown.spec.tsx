import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores/index';
import BuySellHeaderDropdown from '../buy-sell-header-dropdown';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        selected_value: 'rate',
        sort_list: [
            { text: 'Exchange rate', value: 'rate' },
            { text: 'User rating', value: 'rating' },
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
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>IcCashierSort</div>),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('BuySellHeaderDropdown', () => {
    it('should render the dropdown with the selected value in desktop', () => {
        render(<BuySellHeaderDropdown />);

        expect(screen.getByText('Sort by')).toBeInTheDocument();
        expect(screen.getByText('Exchange rate')).toBeInTheDocument();
        expect(screen.getByTestId('dti_dropdown_display')).toBeInTheDocument();
    });
    it('should show the modal upon clicking the dropdown in responsive', async () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<BuySellHeaderDropdown />);

        expect(screen.getByText('IcCashierSort')).toBeInTheDocument();

        const dropdown = screen.getByTestId('dt_buy_sell_header_dropdown');
        userEvent.click(dropdown);

        await waitFor(() => {
            expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'SortModal' });
        });
    });
});
