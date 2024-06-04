import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentTransfer from '../PaymentAgentTransfer';
import { usePaymentAgentTransfer } from '../hooks';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loader</div>),
}));

jest.mock('../components', () => ({
    PaymentAgentTransferConfirm: jest.fn(() => <div>PaymentAgentTransferConfirm</div>),
    PaymentAgentTransferForm: jest.fn(() => <div>PaymentAgentTransferForm</div>),
    PaymentAgentTransferReceipt: jest.fn(() => <div>PaymentAgentTransferReceipt</div>),
}));

jest.mock('../hooks', () => ({
    usePaymentAgentTransfer: jest.fn(() => ({})),
}));

const mockUsePaymentAgentTransfer = usePaymentAgentTransfer as jest.MockedFunction<typeof usePaymentAgentTransfer>;

describe('<PaymentAgentTransfer />', () => {
    it('should show Loader when isLoading equals to true', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the UsePaymentAgentTransfer hook
        mockUsePaymentAgentTransfer.mockReturnValueOnce({ isLoading: true });

        render(<PaymentAgentTransfer />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });

    it('should show PaymentAgentTransferForm on first render', () => {
        render(<PaymentAgentTransfer />);

        expect(screen.getByText('PaymentAgentTransferForm')).toBeInTheDocument();
    });

    it('should show PaymentAgentTransferConfirm component when isTryTransferSuccessful equals to true', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the usePaymentAgentTransfer hook
        mockUsePaymentAgentTransfer.mockReturnValueOnce({ isTryTransferSuccessful: true });
        render(<PaymentAgentTransfer />);

        expect(screen.getByText('PaymentAgentTransferConfirm')).toBeInTheDocument();
    });

    it('should show PaymentAgentTransferReceipt component when isTryTransferSuccessful equals to true', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the UsePaymentAgentTransfer hook
        mockUsePaymentAgentTransfer.mockReturnValueOnce({ isTransferSuccessful: true });
        render(<PaymentAgentTransfer />);

        expect(screen.getByText('PaymentAgentTransferReceipt')).toBeInTheDocument();
    });
});
