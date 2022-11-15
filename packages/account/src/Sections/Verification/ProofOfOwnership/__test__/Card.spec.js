import { fireEvent, render, screen } from '@testing-library/react';
import Card from '../Card.jsx';
import React from 'react';
import { grouped_payment_method_data } from './test-data';

describe('Card.jsx', () => {
    it('Should render a card', () => {
        render(<Card card={grouped_payment_method_data.visa} />);
        expect(
            screen.getByTestId(grouped_payment_method_data.visa.payment_method, { exact: true })
        ).toBeInTheDocument();
    });
    it('Should render an expanded card on button click', () => {
        render(<Card card={grouped_payment_method_data.visa} />);
        const button = screen.getByTestId('dt_proof-of-ownership-button', { exact: true });
        fireEvent.click(button);
        expect(
            screen.getAllByText('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB', {
                exact: true,
            })[0]
        ).toBeInTheDocument();
    });
});
