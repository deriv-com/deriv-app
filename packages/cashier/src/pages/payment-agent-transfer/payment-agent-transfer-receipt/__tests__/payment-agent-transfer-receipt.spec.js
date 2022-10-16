import React from 'react';
import PaymentAgentTransferReceipt from '../payment-agent-transfer-receipt';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<PaymentAgentTransferReceipt />', () => {
    const history = createBrowserHistory();
    const currency = 'currency';
    const receipt = {
        amount_transferred: '1',
        client_id: 'CR9000000',
    };

    it('component should render', () => {
        const { container } = render(
            <Router history={history}>
                <PaymentAgentTransferReceipt currency={currency} receipt={receipt} />
            </Router>
        );

        expect(container.querySelector('.payment-agent-transfer-receipt__wrapper')).toBeInTheDocument();
    });

    it(`should redirect to statement page when click on 'View in statement' button`, () => {
        const resetPaymentAgentTransfer = jest.fn();

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt
                    currency={currency}
                    receipt={receipt}
                    resetPaymentAgentTransfer={resetPaymentAgentTransfer}
                />
            </Router>
        );

        const btn = screen.getByText('View transactions');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes.statement);
    });

    it(`resetPaymentAgentTransfer func should be triggered when click on 'Make a new transfer' button`, () => {
        const resetPaymentAgentTransfer = jest.fn();

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt
                    currency={currency}
                    receipt={receipt}
                    resetPaymentAgentTransfer={resetPaymentAgentTransfer}
                />
            </Router>
        );

        const btn = screen.getByText('Make a new transfer');
        fireEvent.click(btn);

        expect(resetPaymentAgentTransfer).toBeCalledTimes(1);
    });
});
