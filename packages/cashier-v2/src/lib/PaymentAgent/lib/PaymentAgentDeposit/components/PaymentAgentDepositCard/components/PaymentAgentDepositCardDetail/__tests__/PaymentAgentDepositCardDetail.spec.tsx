import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from '../../../../../../../assets/images/ic-cashier-add.svg';
import PaymentAgentDepositCardDetail from '../PaymentAgentDepositCardDetail';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentAgentDepositCardDetail', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentDepositCardDetail>;

    beforeEach(() => {
        mockedProps = {
            children: ['+375291234567', '+375297654321'],
            icon: Icon,
            title: 'Phone number',
            action: 'tel',
        };
    });

    it('should render detail icon', () => {
        render(<PaymentAgentDepositCardDetail {...mockedProps} />);

        const icon = screen.getByTestId('dt_detail_icon');

        expect(icon).toBeInTheDocument();
    });

    it('should render title', () => {
        render(<PaymentAgentDepositCardDetail {...mockedProps} />);

        const title = screen.getByText('Phone number');

        expect(title).toBeInTheDocument();
    });

    it('should render one detail', () => {
        render(<PaymentAgentDepositCardDetail {...mockedProps} action={undefined} children='Payment agent detail' />);

        expect(screen.getByText('Payment agent detail')).toBeInTheDocument();
    });

    it('should render details array', () => {
        render(<PaymentAgentDepositCardDetail {...mockedProps} />);

        expect(screen.getByText(/375291234567/)).toBeInTheDocument();
        expect(screen.getByText(/375297654321/)).toBeInTheDocument();
    });
});
