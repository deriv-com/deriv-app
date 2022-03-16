import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentList from '../payment-agent-list';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/Error/error', () => () => <div>PaymentAgentWithdrawError</div>);
jest.mock('Components/Email/email-sent', () => () => <div>The email has been sent!</div>);
jest.mock('Components/Form/payment-agent-withdraw-form', () => () => <div>Payment agent withdraw form</div>);
jest.mock('Components/Form/payment-agent-deposit', () => () => <div>Payment agent deposit</div>);

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(() => false),
}));

describe('<PaymentAgentList />', () => {
    const props = {
        is_email_sent: true,
        is_loading: false,
        is_payment_agent_withdraw: false,
        payment_agent_active_tab_index: 0,
        verification_code: '',
        onMount: jest.fn(),
    };

    let history;
    const renderWithRouter = component => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>);
    };

    it('should show proper messages, tabs and titles in Deposit tab', () => {
        renderWithRouter(<PaymentAgentList {...props} />);

        expect(screen.getByText('Payment agent deposit')).toBeInTheDocument();
        expect(screen.getByText('DISCLAIMER')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deriv is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
            )
        ).toBeInTheDocument();
    });

    it('should show loader in Deposit tab', () => {
        renderWithRouter(<PaymentAgentList {...props} is_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show withdrawal error message in Withdrawal tab', () => {
        const error = {
            code: 'error code',
            onClickButton: jest.fn(),
        };

        renderWithRouter(<PaymentAgentList {...props} error={error} payment_agent_active_tab_index={1} />);

        expect(screen.getByText('PaymentAgentWithdrawError')).toBeInTheDocument();
    });

    it('should show "The email has been sent!" message in Withdrawal tab', () => {
        renderWithRouter(<PaymentAgentList {...props} payment_agent_active_tab_index={1} />);

        expect(screen.getByText('The email has been sent!')).toBeInTheDocument();
    });

    it('should show "Payment agent withdraw form" message in Withdrawal tab', () => {
        renderWithRouter(
            <PaymentAgentList
                {...props}
                is_email_sent={false}
                is_payment_agent_withdraw
                payment_agent_active_tab_index={1}
                verification_code='1234'
            />
        );

        expect(screen.getByText('Payment agent withdraw form')).toBeInTheDocument();
    });
});
