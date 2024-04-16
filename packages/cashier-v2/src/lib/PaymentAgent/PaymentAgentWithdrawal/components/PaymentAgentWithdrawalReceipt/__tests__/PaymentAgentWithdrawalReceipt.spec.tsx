import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentAgentWithdrawalReceipt from '../PaymentAgentWithdrawalReceipt';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { usePaymentAgentWithdrawalContext } from '../../../../PaymentAgentWithdrawal/provider';

let mockedResetPaymentAgentWithdrawal: jest.MockedFunction<typeof jest.fn>;

const mockedUsePaymentAgentWithdrawalContext = usePaymentAgentWithdrawalContext as jest.MockedFunction<
    typeof usePaymentAgentWithdrawalContext
>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../../../PaymentAgentWithdrawal/provider', () => ({
    usePaymentAgentWithdrawalContext: jest.fn(() => ({
        resetPaymentAgentWithdrawal: mockedResetPaymentAgentWithdrawal,
        withdrawalReceipt: {
            amount: '100',
            currency: 'USD',
            paymentAgentEmail: 'test@test.com',
            paymentAgentName: 'Payment Agent Name',
            paymentAgentPhoneNumbers: [{ phone_number: '+375253113117' }],
            paymentAgentUrls: [{ url: 'https://pawebsite.com' }],
        },
    })),
}));

describe('PaymentAgentWithdrawalReceipt', () => {
    beforeEach(() => {
        mockedResetPaymentAgentWithdrawal = jest.fn();
    });

    it('should show proper title', () => {
        render(<PaymentAgentWithdrawalReceipt />);

        const title = screen.getByText(/You’ve transferred 100.00 USD/);

        expect(title).toBeInTheDocument();
    });

    it('should show proper description when payment agent name is defined', () => {
        render(<PaymentAgentWithdrawalReceipt />);

        expect(screen.getByText(/Important notice to receive your funds/)).toBeInTheDocument();
        expect(
            screen.getByText(/To receive your funds, contact the payment agent with the details below./)
        ).toBeInTheDocument();
        expect(screen.getByText(/You can view the summary of this transaction in your email./)).toBeInTheDocument();
    });

    it('should show proper description when payment agent name is not defined', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUsePaymentAgentWithdrawalContext.mockReturnValueOnce({
            resetPaymentAgentWithdrawal: jest.fn(),
            withdrawalReceipt: {
                amount: '100',
                currency: 'USD',
                paymentAgentEmail: '',
                paymentAgentName: '',
                paymentAgentPhoneNumbers: [],
                paymentAgentUrls: [],
            },
        });

        render(<PaymentAgentWithdrawalReceipt />);

        expect(screen.getByText(/Important notice to receive your funds/)).toBeInTheDocument();
        expect(screen.getByText(/To receive your funds, contact the payment agent/)).toBeInTheDocument();
        expect(screen.getByText(/You can view the summary of this transaction in your email./)).toBeInTheDocument();
    });

    it('should show proper payment agent details', () => {
        render(<PaymentAgentWithdrawalReceipt />);

        expect(screen.getByText("Payment Agent Name's contact details")).toBeInTheDocument();
        expect(screen.getByText('+375253113117')).toBeInTheDocument();
        expect(screen.getByText('test@test.com')).toBeInTheDocument();
        expect(screen.getByText('https://pawebsite.com')).toBeInTheDocument();
    });

    it('should not show details section when payment agent name is not defined', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        mockedUsePaymentAgentWithdrawalContext.mockReturnValueOnce({
            resetPaymentAgentWithdrawal: jest.fn(),
            withdrawalReceipt: {
                amount: '100',
                currency: 'USD',
                paymentAgentEmail: '',
                paymentAgentName: '',
                paymentAgentPhoneNumbers: [],
                paymentAgentUrls: [],
            },
        });

        render(<PaymentAgentWithdrawalReceipt />);

        expect(screen.queryByTestId('dt_details_section')).not.toBeInTheDocument();
    });

    it('should trigger resetPaymentAgentWithdrawal callback when the user is clicking on Make a new withdrawal button', () => {
        render(<PaymentAgentWithdrawalReceipt />);

        const makeANewWithdrawalButton = screen.getByRole('button', {
            name: 'Make a new withdrawal',
        });
        userEvent.click(makeANewWithdrawalButton);

        expect(mockedResetPaymentAgentWithdrawal).toHaveBeenCalledTimes(1);
    });

    it('should redirect the user to /reports/statement route and trigger resetPaymentAgentWithdrawal callback when the user is clicking on View transactions button', () => {
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <PaymentAgentWithdrawalReceipt />
            </Router>
        );

        const viewTransactionsButton = screen.getByRole('button', {
            name: 'View transactions',
        });
        userEvent.click(viewTransactionsButton);

        expect(history.location.pathname).toBe('/reports/statement');
        expect(mockedResetPaymentAgentWithdrawal).toHaveBeenCalledTimes(1);
    });
});
