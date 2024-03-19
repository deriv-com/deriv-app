import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDeposit from '../PaymentAgentDeposit';
import { usePaymentAgentContext } from '../../../provider';

const mockUsePaymentAgentContext = usePaymentAgentContext as jest.MockedFunction<typeof usePaymentAgentContext>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: () => <div>Loader</div>,
}));

jest.mock('../../../provider', () => ({
    PaymentAgentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    usePaymentAgentContext: jest.fn(() => ({
        isPaymentAgentListLoading: false,
    })),
}));

jest.mock('../../../components', () => ({
    PaymentAgentMethodsDropdown: () => <div>PaymentAgentMethodsDropdown</div>,
    PaymentAgentSearchBox: () => <div>PaymentAgentSearchBox</div>,
}));

jest.mock('../components', () => ({
    PaymentAgentDepositList: () => <div>PaymentAgentDepositList</div>,
}));

describe('PaymentAgentDeposit', () => {
    it('should render PaymentAgentDeposit component', () => {
        render(<PaymentAgentDeposit />);

        expect(
            screen.getByText('Contact your preferred payment agent for payment instructions and make your deposit.')
        ).toBeInTheDocument();
        expect(screen.getByText('PaymentAgentMethodsDropdown')).toBeInTheDocument();
        expect(screen.getByText('PaymentAgentSearchBox')).toBeInTheDocument();
        expect(screen.getByText('PaymentAgentDepositList')).toBeInTheDocument();
    });

    it('should show Loader if isPaymentAgentListLoading is equal to true', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUsePaymentAgentContext.mockReturnValueOnce({
            isPaymentAgentListLoading: true,
        });

        render(<PaymentAgentDeposit />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });
});
