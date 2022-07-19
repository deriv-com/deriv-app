import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaymentAgentWithdrawForm from '../payment-agent-withdraw-form';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    validNumber: jest.fn(() => true),
}));

describe('<PaymentAgentWithdrawForm />', () => {
    const onMount = jest.fn();
    const resetPaymentAgent = jest.fn();
    const payment_agent_list = [
        {
            currencies: 'USD',
            deposit_commission: '0',
            email: 'test@example.com',
            further_information: 'Test Info',
            max_withdrawal: '2000',
            min_withdrawal: '10',
            name: 'Payment Agent',
            paymentagent_loginid: 'CR90000874',
            summary: 'Test Summary',
            supported_banks: null,
            telephone: '+12345678',
            url: 'http://www.MyPAMyAdventure.com/',
            withdrawal_commission: '0',
        },
    ];

    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component', () => {
        const { container } = render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        expect(container.firstChild).toHaveClass('payment-agent-withdraw-form__withdrawal');
    });

    it('should show the withdrawal confirmation', () => {
        const { container } = render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                is_try_withdraw_successful
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        expect(container.firstChild).toHaveClass('cashier__wrapper--confirm');
    });

    it('should show an error if amount is not provided', async () => {
        render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        const withdraw_button = screen.getByRole('button');
        fireEvent.click(withdraw_button);

        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should not proceed if amount is greater than the withdrawal limit', async () => {
        const { container } = render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        const amount = container.querySelector('input[name=amount]');
        const withdraw_button = screen.getByRole('button');

        fireEvent.change(amount, { target: { value: '2500' } });
        fireEvent.click(withdraw_button);

        await waitFor(() => {
            expect(withdraw_button).toBeDisabled();
        });
    });

    it('should not proceed if payment agent id is invalid', async () => {
        const { container } = render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        const payment_agent = container.querySelector('input[name=payment_agent]');
        const withdraw_button = screen.getByRole('button');

        fireEvent.change(payment_agent, { target: { value: 'abc' } });
        fireEvent.click(withdraw_button);

        await waitFor(() => {
            expect(withdraw_button).toBeDisabled();
        });
    });
});
