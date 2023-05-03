import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CashierWalletModalBody from '../cashier-wallet-modal-body';

describe('CashierWalletModalBody', () => {
    let mocked_props: React.ComponentProps<typeof CashierWalletModalBody>;

    beforeEach(() => {
        mocked_props = {
            active_tab_index: 0,
            is_dark: false,
            is_demo: true,
            setActiveTabIndex: jest.fn(),
            show_wallet_name: true,
            wallet_type: 'demo',
        };
    });

    const renderWithRouter = (component: JSX.Element) => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('Should render proper tabs for demo wallet with proper content', () => {
        renderWithRouter(<CashierWalletModalBody {...mocked_props} />);

        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transfer Demo')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Reset balanace')).toBeInTheDocument();
    });

    it('Shoud trigger setActiveTabIndex callback when the user clicked on the tab', () => {
        renderWithRouter(<CashierWalletModalBody {...mocked_props} />);

        const el_transactions_tab = screen.getByText('Transactions');
        userEvent.click(el_transactions_tab);

        expect(mocked_props.setActiveTabIndex).toHaveBeenCalledTimes(1);
    });
});
