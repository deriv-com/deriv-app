import React from 'react';
import { render, screen } from '@testing-library/react';
import SideNotePaymentMethodsLearnMore from '../side-note-payment-methods-learn-more';

describe('SideNotePaymentMethodsLearnMore', () => {
    test('should render learn more about payment methods side note', () => {
        render(<SideNotePaymentMethodsLearnMore />);

        expect(screen.getByText(/Learn more about/)).toBeInTheDocument();
    });
});
