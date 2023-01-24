import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { routes } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import AccountTransferReceipt from '../account-transfer-receipt';

describe('<AccountTransferReceipt />', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                loginid: 'CR90000401',
                switchAccount: jest.fn(),
            },
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            common: {
                is_from_derivgo: false,
            },
            modules: {
                cashier: {
                    account_transfer: {
                        resetAccountTransfer: jest.fn(),
                        selected_to: {
                            balance: '0.01194762',
                            currency: 'BTC',
                            is_crypto: true,
                            is_dxtrade: false,
                            is_mt: false,
                            text: 'BTC',
                            value: 'CR90000401',
                        },
                        selected_from: {
                            balance: '9400.00',
                            currency: 'USD',
                            is_crypto: false,
                            is_dxtrade: false,
                            is_mt: false,
                            text: 'USD',
                            value: 'CR90000400',
                        },
                        receipt: { amount_transferred: '100' },
                    },
                },
            },
        };
    });

    const history = createBrowserHistory();
    const renderAccountTransferReceipt = () =>
        render(<AccountTransferReceipt />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </StoreProvider>
            ),
        });

    it('should show "Your funds have been transferred" message, "View transaction details" and "Make a new transfer" buttons', () => {
        renderAccountTransferReceipt();

        expect(screen.getByText('Your funds have been transferred')).toBeInTheDocument();
        expect(screen.getByText('View transaction details')).toBeInTheDocument();
        expect(screen.getByText('Make a new transfer')).toBeInTheDocument();
    });

    it('should redirect to "/reports/statement", when the "View transaction details" button was clicked', () => {
        renderAccountTransferReceipt();

        const view_transaction_btn = screen.getByText('View transaction details');
        fireEvent.click(view_transaction_btn);

        expect(history.location.pathname).toBe(routes.statement);
    });

    it('should reset account transfer, when the "Make a new transfer" button was clicked', () => {
        renderAccountTransferReceipt();

        const make_a_new_transfer_btn = screen.getByText('Make a new transfer');
        fireEvent.click(make_a_new_transfer_btn);

        expect(mockRootStore.modules.cashier.account_transfer.resetAccountTransfer).toHaveBeenCalledTimes(1);
    });

    it('should not show "We’re switching over to your {{currency}} account to view the transaction." message, when the "Cancel" button was clicked', async () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        mockRootStore.client.loginid = 'CR90000403';

        renderAccountTransferReceipt();

        const view_transaction_btn = screen.getByText('View transaction details');
        fireEvent.click(view_transaction_btn);

        expect(
            screen.getByText('We’re switching over to your BTC account to view the transaction.')
        ).toBeInTheDocument();
        const cancel_btn = screen.getByText('Cancel');
        fireEvent.click(cancel_btn);
        await waitFor(() => {
            expect(
                screen.queryByText('We’re switching over to your BTC account to view the transaction.')
            ).not.toBeInTheDocument();
        });
    });

    it('should redirect to "/reports/statement", when the "Switch to {currency} account" button was clicked', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        mockRootStore.client.loginid = 'CR90000403';

        renderAccountTransferReceipt();

        const view_transaction_btn = screen.getByText('View transaction details');
        fireEvent.click(view_transaction_btn);
        const switch_to_currency_acc = screen.getByText('Switch to BTC account');
        fireEvent.click(switch_to_currency_acc);

        expect(history.location.pathname).toBe(routes.statement);
    });
});
