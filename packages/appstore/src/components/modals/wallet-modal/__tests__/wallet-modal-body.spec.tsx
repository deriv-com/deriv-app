import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import WalletModalBody from '../wallet-modal-body';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: () => ({ data: {} }),
}));

describe('WalletModalBody', () => {
    let mocked_props: React.ComponentProps<typeof WalletModalBody>;

    beforeEach(() => {
        mocked_props = {
            active_tab_index: 0,
            is_dark: false,
            is_demo: true,
            is_mobile: false,
            setActiveTabIndex: jest.fn(),
            setIsScrollable: jest.fn(),
            setIsWalletNameVisible: jest.fn(),
            is_wallet_name_visible: true,
            wallet_type: 'demo',
        };
    });

    const renderWithRouter = (component: JSX.Element) => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('Should render proper amount of tabs for demo wallet', () => {
        const mock = mockStore({});

        renderWithRouter(
            <StoreProvider store={mock}>
                <WalletModalBody {...mocked_props} />
            </StoreProvider>
        );

        expect(screen.getAllByTestId('dt_tab_element').length).toBe(3);
    });

    it('Should trigger setActiveTabIndex callback when the user clicked on the tab', () => {
        const mock = mockStore({});

        renderWithRouter(
            <StoreProvider store={mock}>
                <WalletModalBody {...mocked_props} />
            </StoreProvider>
        );

        const el_transactions_tab = screen.getByText('Transactions');
        userEvent.click(el_transactions_tab);

        expect(mocked_props.setActiveTabIndex).toHaveBeenCalledTimes(1);
    });
});
