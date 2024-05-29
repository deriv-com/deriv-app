import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import PaymentAgentCardWithdrawalForm from '../PaymentAgentCardWithdrawalForm';

const mockedRequestTryPaymentAgentWithdrawal = jest.fn();

jest.mock('../../../../../PaymentAgentWithdrawal/provider', () => ({
    usePaymentAgentWithdrawalContext: jest.fn(() => ({
        requestTryPaymentAgentWithdrawal: mockedRequestTryPaymentAgentWithdrawal,
        getPaymentAgentWithdrawalValidationSchema: jest.fn(),
    })),
}));

describe('PaymentAgentCardWithdrawalForm', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentCardWithdrawalForm>;

    beforeEach(() => {
        mockedProps = {
            //@ts-expect-error since this is a mock, we only need partial properties of data
            paymentAgent: {
                currencies: 'USD',
                max_withdrawal: '1000',
                min_withdrawal: '10',
                paymentagent_loginid: 'CR1234567',
            },
        };
    });

    it('should show proper title', () => {
        render(<PaymentAgentCardWithdrawalForm {...mockedProps} />);

        const title = screen.getByText('Withdrawal amount');

        expect(title).toBeInTheDocument();
    });

    it('should show proper withdrawal limits', () => {
        render(<PaymentAgentCardWithdrawalForm {...mockedProps} />);

        const withdrawalLimits = screen.getByText('Withdrawal limits: 10.00 USD-1,000.00 USD');

        expect(withdrawalLimits).toBeInTheDocument();
    });

    it('continue button should be disabled by default', () => {
        render(<PaymentAgentCardWithdrawalForm {...mockedProps} />);

        const continueBtn = screen.getByRole('button', {
            name: 'Continue',
        });

        expect(continueBtn).toBeDisabled();
    });

    it('should trigger requestTryPaymentAgentWithdrawal callback when submitting the form', async () => {
        render(<PaymentAgentCardWithdrawalForm {...mockedProps} />);

        const amountInput = screen.getByRole('textbox');
        const continueBtn = screen.getByRole('button', {
            name: 'Continue',
        });

        userEvent.type(amountInput, '100');
        userEvent.click(continueBtn);

        await waitFor(() => {
            expect(mockedRequestTryPaymentAgentWithdrawal).toHaveBeenCalledWith({
                amount: 100,
                paymentagent_loginid: 'CR1234567',
            });
        });
    });
});
