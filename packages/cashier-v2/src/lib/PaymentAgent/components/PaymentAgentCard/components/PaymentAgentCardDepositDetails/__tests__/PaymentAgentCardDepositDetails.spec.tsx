import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentCardDepositDetails from '../PaymentAgentCardDepositDetails';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentAgentCardDepositDetails', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentCardDepositDetails>;

    beforeEach(() => {
        mockedProps = {
            //@ts-expect-error since this is a mock, we only need partial properties of payment agent
            paymentAgent: {
                currencies: 'USD',
                deposit_commission: '1',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                phone_numbers: [{ phone_number: '375291234567' }, { phone_number: '375297654321' }],
                withdrawal_commission: '2',
            },
        };
    });

    it('should render proper payment agent details', () => {
        render(<PaymentAgentCardDepositDetails {...mockedProps} />);

        expect(screen.getByText('Phone number')).toBeInTheDocument();
        expect(screen.getByText(/375291234567/)).toBeInTheDocument();
        expect(screen.getByText(/375297654321/)).toBeInTheDocument();
        expect(screen.getByText('Transfer limit')).toBeInTheDocument();
        expect(screen.getByText(/10.00 USD/)).toBeInTheDocument();
        expect(screen.getByText(/2,000.00 USD/)).toBeInTheDocument();
        expect(screen.getByText('Commission on deposits')).toBeInTheDocument();
        expect(screen.getByText('1%')).toBeInTheDocument();
        expect(screen.getByText('Commission on withdrawal')).toBeInTheDocument();
        expect(screen.getByText('2%')).toBeInTheDocument();
    });
});
