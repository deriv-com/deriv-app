import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentAgentTransferForm from '../PaymentAgentTransferForm';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('<PaymentAgentTransferForm />', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentTransferForm>;

    beforeEach(() => {
        mockedProps = {
            // @ts-expect-error - since this is a mock, we only need partial properties of the useActiveAccount hook
            activeAccount: {
                currency: 'USD',
            },
            requestTryPaymentAgentTransfer: jest.fn(),
            transferConfirm: {
                amount: '',
                clientID: '',
                clientName: '',
                currency: 'USD',
                description: '',
            },
            validateTransferPassthrough: jest.fn(),
        };
    });

    it('should render proper title in desktop', () => {
        render(<PaymentAgentTransferForm {...mockedProps} />);

        const title = screen.getByText('Transfer to client');

        expect(title).toBeInTheDocument();
    });

    it('Transfer button should be disabled by default', () => {
        render(<PaymentAgentTransferForm {...mockedProps} />);

        const transferButton = screen.getByRole('button', {
            name: 'Transfer',
        });

        expect(transferButton).toBeDisabled();
    });

    it('Transfer button should be enabled when the form is valid', () => {
        render(<PaymentAgentTransferForm {...mockedProps} />);

        const amountInput = screen.getByTestId('dt_payment_agent_transfer_form_input_amount');
        const loginidInput = screen.getByTestId('dt_payment_agent_transfer_form_input_loginid');
        const transferButton = screen.getByRole('button', {
            name: 'Transfer',
        });

        userEvent.type(amountInput, '10');
        userEvent.type(loginidInput, 'CR1234567');

        expect(transferButton).toBeEnabled();
    });

    it('Transfer button should be disabled when the form is submitting', () => {
        render(<PaymentAgentTransferForm {...mockedProps} />);

        const amountInput = screen.getByTestId('dt_payment_agent_transfer_form_input_amount');
        const loginidInput = screen.getByTestId('dt_payment_agent_transfer_form_input_loginid');
        const transferButton = screen.getByRole('button', {
            name: 'Transfer',
        });

        userEvent.type(amountInput, '10');
        userEvent.type(loginidInput, 'CR1234567');
        userEvent.click(transferButton);

        expect(transferButton).toBeDisabled();
    });

    it('should trigger requestTryPaymentAgentTransfer callback when the user is clicking on Transfer button', async () => {
        render(<PaymentAgentTransferForm {...mockedProps} />);

        const amountInput = screen.getByTestId('dt_payment_agent_transfer_form_input_amount');
        const loginidInput = screen.getByTestId('dt_payment_agent_transfer_form_input_loginid');
        const transferButton = screen.getByRole('button', {
            name: 'Transfer',
        });

        userEvent.type(amountInput, '10');
        userEvent.type(loginidInput, 'CR1234567');
        userEvent.click(transferButton);

        await waitFor(() => {
            expect(mockedProps.requestTryPaymentAgentTransfer).toHaveBeenCalledWith({
                amount: 10,
                description: '',
                transfer_to: 'CR1234567',
            });
        });
    });
});
