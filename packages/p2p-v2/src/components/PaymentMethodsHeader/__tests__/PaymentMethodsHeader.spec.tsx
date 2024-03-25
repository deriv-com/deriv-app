import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodsHeader from '../PaymentMethodsHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('PaymentMethodsHeader', () => {
    it('should render the component correctly', () => {
        render(<PaymentMethodsHeader title='Payment Methods' />);
        expect(screen.getByText('Payment Methods')).toBeInTheDocument();
    });
    it('should render the arrow, when ongoback is passed in', () => {
        render(<PaymentMethodsHeader onGoBack={() => undefined} title='Payment Methods' />);
        expect(screen.getByTestId('dt_p2p_v2_payment_methods_header_left_arrow_icon')).toBeInTheDocument();
    });
});
