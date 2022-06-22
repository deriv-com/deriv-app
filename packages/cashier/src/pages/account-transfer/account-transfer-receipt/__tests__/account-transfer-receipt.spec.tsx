import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AccountTransferReceipt from '../account-transfer-receipt';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<AccountTransferReceipt />', () => {
    const mockProps = loginid_value => {
        const history = createBrowserHistory();
        const resetAccountTransfer = jest.fn();
        const switchAccount = jest.fn();
        const selected_to = {
            balance: '0.01194762',
            currency: 'BTC',
            is_crypto: true,
            is_dxtrade: false,
            is_mt: false,
            text: 'BTC',
            value: 'CR90000401',
        };
        const selected_from = {
            balance: '9400.00',
            currency: 'USD',
            is_crypto: false,
            is_dxtrade: false,
            is_mt: false,
            text: 'USD',
            value: 'CR90000400',
        };
        const loginid = loginid_value;
        const receipt = { amount_transferred: '100' };

        return { history, loginid, receipt, selected_from, selected_to, resetAccountTransfer, switchAccount };
    };

    it('should show "Your funds have been transferred" message, "View transaction details" and "Make a new transfer" buttons', () => {
        const props = mockProps('CR90000401');

        render(
            <Router history={props.history}>
                <AccountTransferReceipt {...props} />
            </Router>
        );

        expect(screen.getByText('Your funds have been transferred')).toBeInTheDocument();
        expect(screen.getByText('View transaction details')).toBeInTheDocument();
        expect(screen.getByText('Make a new transfer')).toBeInTheDocument();
    });

    it('should redirect to "/reports/statement", when the "View transaction details" button was clicked', () => {
        const props = mockProps('CR90000401');

        render(
            <Router history={props.history}>
                <AccountTransferReceipt {...props} />
            </Router>
        );

        const view_transaction_btn = screen.getByText('View transaction details');
        fireEvent.click(view_transaction_btn);
        expect(props.history.location.pathname).toBe(routes.statement);
    });

    it('should reset account transfer, when the "Make a new transfer" button was clicked', () => {
        const props = mockProps('CR90000401');

        render(
            <Router history={props.history}>
                <AccountTransferReceipt {...props} />
            </Router>
        );

        const make_a_new_transfer_btn = screen.getByText('Make a new transfer');
        fireEvent.click(make_a_new_transfer_btn);
        expect(props.resetAccountTransfer).toHaveBeenCalledTimes(1);
    });

    it('should not show "We’re switching over to your {{currency}} account to view the transaction." message, when the "Cancel" button was clicked', async () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        const props = mockProps('CR90000403');

        render(
            <Router history={props.history}>
                <AccountTransferReceipt {...props} />
            </Router>
        );

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

        const props = mockProps('CR90000403');
        props.switchAccount = jest.fn();

        render(
            <Router history={props.history}>
                <AccountTransferReceipt {...props} />
            </Router>
        );

        const view_transaction_btn = screen.getByText('View transaction details');
        fireEvent.click(view_transaction_btn);
        const switch_to_currency_acc = screen.getByText('Switch to BTC account');
        fireEvent.click(switch_to_currency_acc);
        expect(props.history.location.pathname).toBe(routes.statement);
    });
});
