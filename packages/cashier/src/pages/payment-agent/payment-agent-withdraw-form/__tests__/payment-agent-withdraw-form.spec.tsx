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
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.removeChild(modal_root_el);
    });

    it('should render the component', () => {
        render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        expect(screen.getByTestId('dt_payment_agent_withdraw_form')).toHaveClass(
            'payment-agent-withdraw-form__withdrawal'
        );
    });

    it('should show the withdrawal confirmation', () => {
        render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                is_try_withdraw_successful
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        expect(screen.getByTestId('dt_cashier_wrapper_confirm')).toHaveClass('cashier__wrapper--confirm');
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
        render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        const amount = screen.getByTestId('dt_cashier_input_amount');
        const withdraw_button = screen.getByRole('button');

        fireEvent.change(amount, { target: { value: '2500' } });
        fireEvent.click(withdraw_button);

        await waitFor(() => {
            expect(withdraw_button).toBeDisabled();
        });
    });

    it('should not proceed if payment agent id is invalid', async () => {
        render(
            <PaymentAgentWithdrawForm
                currency={'USD'}
                onMount={onMount}
                payment_agent_list={payment_agent_list}
                resetPaymentAgent={resetPaymentAgent}
            />
        );

        const payment_agent = screen.getByTestId('dt_cashier_input_payment_agent');
        const withdraw_button = screen.getByRole('button');

        fireEvent.change(payment_agent, { target: { value: 'abc' } });
        fireEvent.click(withdraw_button);

        await waitFor(() => {
            expect(withdraw_button).toBeDisabled();
        });
    });
});
