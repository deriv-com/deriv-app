import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import PaymentAgentUnlistedWithdrawalForm from '../PaymentAgentUnlistedWithdrawalForm';

const mockedRequestTryPaymentAgentWithdrawal = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(() => ({ data: { currency_config: { display_code: 'USD' } } })),
}));

jest.mock('../../../../PaymentAgentWithdrawal/provider', () => ({
    usePaymentAgentWithdrawalContext: jest.fn(() => ({
        requestTryPaymentAgentWithdrawal: mockedRequestTryPaymentAgentWithdrawal,
        getPaymentAgentWithdrawalValidationSchema: jest.fn(),
        setIsUnlistedWithdrawal: jest.fn(),
    })),
}));

describe('PaymentAgentUnlistedWithdrawalForm', () => {
    it('should show Back to list title and icon', () => {
        render(<PaymentAgentUnlistedWithdrawalForm />);

        const title = screen.getByText('Back to list');
        const backArrowIcon = screen.getByTestId('dt-back-arrow-icon');

        expect(title).toBeInTheDocument();
        expect(backArrowIcon).toBeInTheDocument();
    });

    it('continue button should be disabled by default', () => {
        render(<PaymentAgentUnlistedWithdrawalForm />);

        const continueBtn = screen.getByRole('button', {
            name: 'Continue',
        });

        expect(continueBtn).toBeDisabled();
    });

    it('should trigger requestTryPaymentAgentWithdrawal callback when submitting the form', async () => {
        render(<PaymentAgentUnlistedWithdrawalForm />);

        const accountNumberInput = screen.getAllByRole('textbox')[0];
        const amountInput = screen.getAllByRole('textbox')[1];
        const continueBtn = screen.getByRole('button', {
            name: 'Continue',
        });

        userEvent.type(accountNumberInput, 'CR1234567');
        userEvent.type(amountInput, '100');
        userEvent.click(continueBtn);

        await waitFor(() => {
            expect(mockedRequestTryPaymentAgentWithdrawal).toHaveBeenCalledWith({
                paymentagent_loginid: 'CR1234567',
                amount: 100,
            });
        });
    });

    it('should show proper note', () => {
        render(<PaymentAgentUnlistedWithdrawalForm />);

        const note = screen.getByText('Note: Deriv does not charge any transfer fees.');

        expect(note).toBeInTheDocument();
    });
});
