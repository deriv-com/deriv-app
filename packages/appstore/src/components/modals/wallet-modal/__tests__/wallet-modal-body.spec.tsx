import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import WalletModalBody from '../wallet-modal-body';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('Components/wallet-transfer', () => jest.fn(() => <div>WalletTransfer</div>));
jest.mock('Components/fiat-transaction-list', () => jest.fn(() => <div>Transactions</div>));

describe('WalletModalBody', () => {
    let mocked_props: React.ComponentProps<typeof WalletModalBody>;

    beforeEach(() => {
        mocked_props = {
            active_tab_index: 0,
            contentScrollHandler: jest.fn(),
            is_dark: false,
            is_demo: true,
            is_mobile: false,
            setActiveTabIndex: jest.fn(),
            setIsWalletNameVisible: jest.fn(),
            is_wallet_name_visible: true,
            wallet_type: 'demo',
        };
    });

    const renderWithRouter = (component: JSX.Element) => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('Should render proper tabs for demo wallet', () => {
        renderWithRouter(<WalletModalBody {...mocked_props} />);

        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    it('Should render proper content under the Transfer tab', () => {
        mocked_props.active_tab_index = 1;
        renderWithRouter(<WalletModalBody {...mocked_props} />);

        const el_transfer_tab = screen.getByText('Transfer');
        userEvent.click(el_transfer_tab);

        expect(screen.getByText('WalletTransfer')).toBeInTheDocument();
    });

    it('Should trigger setActiveTabIndex callback when the user clicked on the tab', () => {
        renderWithRouter(<WalletModalBody {...mocked_props} />);

        const el_transactions_tab = screen.getByText('Transactions');
        userEvent.click(el_transactions_tab);

        expect(mocked_props.setActiveTabIndex).toHaveBeenCalledTimes(1);
    });

    it('Should trigger contentScrollHandler callback when the user scrolls the content', () => {
        renderWithRouter(<WalletModalBody {...mocked_props} />);

        const el_themed_scrollbars = screen.getByTestId('dt_themed_scrollbars');
        fireEvent.scroll(el_themed_scrollbars);

        expect(mocked_props.contentScrollHandler).toHaveBeenCalledTimes(1);
    });
});
