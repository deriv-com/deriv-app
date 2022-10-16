import React from 'react';
import PaymentAgentReceipt from '../payment-agent-receipt';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<PaymentAgentReceipt />', () => {
    const mockProps = () => ({
        currency: 'USD',
        loginid: 'CR90000170',
        receipt: {
            amount_transferred: '20.00',
            payment_agent_email: 'reshma+cr1@binary.com',
            payment_agent_id: 'CR90000089',
            payment_agent_name: 'Ms QA script reshmacrcdD',
            payment_agent_phone: '+62417522087',
            payment_agent_url: 'https://deriv.com/',
        },
        resetPaymentAgent: jest.fn(),
    });

    it('should show the proper text/messages', () => {
        const history = createBrowserHistory();
        const props = mockProps();
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );
        expect(screen.getByText('Your funds have been transferred')).toBeInTheDocument();
        expect(screen.getByText('20.00 USD')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByText('CR90000170')).toBeInTheDocument();
        expect(screen.getByText('Ms QA script reshmacrcdD')).toBeInTheDocument();
        expect(screen.getByText('CR90000089')).toBeInTheDocument();
        expect(screen.getByText('IMPORTANT NOTICE TO RECEIVE YOUR FUNDS')).toBeInTheDocument();
        expect(
            screen.getByText(
                "You're not done yet. To receive the transferred funds, you must contact the payment agent for further instruction. A summary of this transaction has been emailed to you for your records."
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Ms QA script reshmacrcdD agent contact details:')).toBeInTheDocument();
        expect(screen.getByText('reshma+cr1@binary.com')).toBeInTheDocument();
        expect(screen.getByText('View in statement')).toBeInTheDocument();
        expect(screen.getByText('Make a new transfer')).toBeInTheDocument();
    });

    it('should redirect to "/reports/statement" when the "View in statement" button is clicked', () => {
        const history = createBrowserHistory();
        const props = mockProps();
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );

        const view_in_statement_btn = screen.getByText('View in statement');
        fireEvent.click(view_in_statement_btn);
        expect(history.location.pathname).toBe(routes.statement);
    });

    it('should trigger onClick callback when the "Make a new transfer" button is clicked', () => {
        const history = createBrowserHistory();
        const props = mockProps();
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );

        const make_new_transfer_btn = screen.getByText('Make a new transfer');
        fireEvent.click(make_new_transfer_btn);
        expect(props.resetPaymentAgent).toHaveBeenCalledTimes(1);
    });
});
