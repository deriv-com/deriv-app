import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from '../../../../../../../assets/images/ic-cashier-add.svg';
import PaymentAgentReceiptDetail from '../PaymentAgentReceiptDetail';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentAgentCardDetail', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentReceiptDetail>;

    beforeEach(() => {
        mockedProps = {
            children: ['+375291234567', '+375297654321'],
            icon: Icon,
            action: 'tel',
        };
    });

    it('should render detail icon', () => {
        render(<PaymentAgentReceiptDetail {...mockedProps} />);

        const icon = screen.getByTestId('dt_detail_icon');

        expect(icon).toBeInTheDocument();
    });

    it('should render one detail', () => {
        render(<PaymentAgentReceiptDetail {...mockedProps} action={undefined} children='Payment agent detail' />);

        expect(screen.getByText('Payment agent detail')).toBeInTheDocument();
    });

    it('should render details array', () => {
        render(<PaymentAgentReceiptDetail {...mockedProps} />);

        expect(screen.getByText(/375291234567/)).toBeInTheDocument();
        expect(screen.getByText(/375297654321/)).toBeInTheDocument();
    });
});
