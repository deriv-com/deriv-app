import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import WalletModalBody from '../wallet-modal-body';

describe('WalletModalBody', () => {
    let mocked_props: React.ComponentProps<typeof WalletModalBody>;

    beforeEach(() => {
        mocked_props = {
            active_tab_index: 0,
            is_dark: false,
            is_demo: true,
            setActiveTabIndex: jest.fn(),
            is_wallet_name_visible: true,
            wallet_type: 'demo',
        };
    });

    const renderWithRouter = (component: JSX.Element) => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('Should render proper tabs for demo wallet with proper content', () => {
        renderWithRouter(<WalletModalBody {...mocked_props} />);

        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transfer Demo')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    it('Shoud trigger setActiveTabIndex callback when the user clicked on the tab', () => {
        renderWithRouter(<WalletModalBody {...mocked_props} />);

        const el_transactions_tab = screen.getByText('Transactions');
        userEvent.click(el_transactions_tab);

        expect(mocked_props.setActiveTabIndex).toHaveBeenCalledTimes(1);
    });
});
