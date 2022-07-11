/* eslint-disable testing-library/no-container,testing-library/no-node-access */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import PaymentAgentTransferReceipt from '../payment-agent-transfer-receipt';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<PaymentAgentTransferReceipt />', () => {
    const history = createBrowserHistory();
    const mockProps = () => ({
        currency: 'currency',
        receipt: {
            amount_transferred: '1',
            client_id: 'CR9000000',
        },
        resetPaymentAgentTransfer: jest.fn(),
    });

    it('component should render', () => {
        const props = mockProps();
        const { container } = render(
            <Router history={history}>
                <PaymentAgentTransferReceipt {...props} />
            </Router>
        );

        expect(container.querySelector('.payment-agent-transfer-receipt__wrapper')).toBeInTheDocument();
    });

    it(`should redirect to statement page when click on 'View in statement' button`, () => {
        const props = mockProps();

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt {...props} />
            </Router>
        );

        const btn = screen.getByText('View in statement');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes.statement);
    });

    it(`resetPaymentAgentTransfer func should be triggered when click on 'Make a new transfer' button`, () => {
        const props = mockProps();

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt {...props} />
            </Router>
        );

        const btn = screen.getByText('Make a new transfer');
        fireEvent.click(btn);

        expect(props.resetPaymentAgentTransfer).toBeCalledTimes(1);
    });
});
