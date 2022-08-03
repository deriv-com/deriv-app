import React from 'react';
import PaymentAgentReceipt from '../payment-agent-receipt';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile, routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('Pages/payment-agent/payment-agent-disclaimer', () => () => <div>PaymentAgentDisclaimer</div>);

describe('<PaymentAgentReceipt />', () => {
    const history = createBrowserHistory();
    const props = {
        currency: 'USD',
        is_from_derivgo: false,
        loginid: 'CR90000170',
        receipt: {
            amount_transferred: '20.00',
            payment_agent_email: 'reshma+cr1@binary.com',
            payment_agent_id: 'CR90000089',
            payment_agent_name: 'Ms QA script reshmacrcdD',
            payment_agent_phone: [{ phone_number: '+62417522087' }],
            payment_agent_url: [{ url: 'https://deriv.com/' }],
        },
        resetPaymentAgent: jest.fn(),
    };

    it('should show the proper text/messages', () => {
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );

        const [view_transactions_btn, make_a_new_withdrawal_btn] = screen.getAllByRole('button');

        expect(screen.getByText('You’ve transferred 20.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Important notice to receive your funds')).toBeInTheDocument();
        expect(
            screen.getByText(/to receive your funds, contact the payment agent with the details below/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/you can view the summary of this transaction in your email/i)).toBeInTheDocument();
        expect(screen.getByText('Ms QA script reshmacrcdD')).toBeInTheDocument();
        expect(screen.getByText("'s")).toBeInTheDocument();
        expect(screen.getByText('contact details')).toBeInTheDocument();
        expect(screen.getByText('+62417522087')).toBeInTheDocument();
        expect(screen.getByText('reshma+cr1@binary.com')).toBeInTheDocument();
        expect(view_transactions_btn).toBeInTheDocument();
        expect(make_a_new_withdrawal_btn).toBeInTheDocument();
    });

    it('should redirect to "/reports/statement" when the "View transactions" button is clicked', () => {
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );

        const [view_transactions_btn] = screen.getAllByRole('button');
        fireEvent.click(view_transactions_btn);
        expect(history.location.pathname).toBe(routes.statement);
    });

    it('should trigger onClick callback when the "Make a new withdrawal" button is clicked', () => {
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );

        const [_, make_a_new_withdrawal_btn] = screen.getAllByRole('button');

        fireEvent.click(make_a_new_withdrawal_btn);
        expect(props.resetPaymentAgent).toHaveBeenCalledTimes(1);
    });

    it('should not show "View transactions" if is_from_derivgo equal to true', () => {
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} is_from_derivgo />
            </Router>
        );

        expect(screen.getAllByRole('button').length).toBe(1);
    });

    it('should show PaymentAgentDisclaimer in mobile view', () => {
        isMobile.mockReturnValue(true);
        render(
            <Router history={history}>
                <PaymentAgentReceipt {...props} />
            </Router>
        );

        expect(screen.getByText('PaymentAgentDisclaimer')).toBeInTheDocument();
    });
});
