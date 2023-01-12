import { fireEvent, render, screen } from '@testing-library/react';
import Card from '../card.jsx';
import React from 'react';
import { grouped_payment_method_data } from './test-data';

describe('card.jsx', () => {
    it('Should render a card', () => {
        render(<Card card={grouped_payment_method_data.visa} />);
        expect(screen.getByTestId(grouped_payment_method_data.visa.payment_method)).toBeInTheDocument();
    });
    it('Should render an expanded card on button click', () => {
        render(<Card card={grouped_payment_method_data.visa} />);
        const button = screen.getByTestId('dt_proof-of-ownership-button');
        fireEvent.click(button);
        expect(
            screen.getAllByText('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB')[0]
        ).toBeInTheDocument();
    });
});
