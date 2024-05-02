import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaymentMethodTitle } from '../PaymentMethodTitle';

describe('PaymentMethodTitle', () => {
    it('should render Icon and title for provided payment method', () => {
        render(<PaymentMethodTitle paymentMethod='VISA' />);

        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByText('VISA')).toBeInTheDocument();
    });
});
