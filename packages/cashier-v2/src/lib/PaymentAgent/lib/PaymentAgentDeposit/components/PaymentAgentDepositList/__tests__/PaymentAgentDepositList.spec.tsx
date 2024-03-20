import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDepositList from '../PaymentAgentDepositList';
import { usePaymentAgentContext } from '../../../../../provider';

const mockUsePaymentAgentContext = usePaymentAgentContext as jest.MockedFunction<typeof usePaymentAgentContext>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: () => <div>Loader</div>,
}));

jest.mock('../../../../../provider', () => ({
    usePaymentAgentContext: jest.fn(() => ({
        isSearchLoading: false,
        paymentAgentList: [{ name: 'PaymentAgent-1' }, { name: 'PaymentAgent-2' }],
    })),
}));

jest.mock('../../PaymentAgentDepositCard', () => ({
    PaymentAgentDepositCard: ({ name }: { name: string }) => <div key={name}>PaymentAgentDepositCard</div>,
}));

jest.mock('../../../../../components', () => ({
    PaymentAgentSearchWarning: () => <div>PaymentAgentSearchWarning</div>,
}));

describe('PaymentAgentDepositList', () => {
    it('should show 2 payment agent cards', () => {
        render(<PaymentAgentDepositList />);

        expect(screen.getAllByText('PaymentAgentDepositCard').length).toBe(2);
    });

    it('should show PaymentAgentSearchWarning when there are no payment agents', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUsePaymentAgentContext.mockReturnValueOnce({
            isSearchLoading: false,
            paymentAgentList: [],
        });

        render(<PaymentAgentDepositList />);

        expect(screen.getByText('PaymentAgentSearchWarning')).toBeInTheDocument();
    });

    it('should show Loader if isSearchLoading is equal to true', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUsePaymentAgentContext.mockReturnValueOnce({
            isSearchLoading: true,
            paymentAgentList: [],
        });

        render(<PaymentAgentDepositList />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });
});
