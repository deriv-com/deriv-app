import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandedCard from '../ExpandedCard.jsx';

describe('ExpandedCard.jsx', () => {
    let card_details;

    beforeAll(() => {
        card_details = {
            icon: 'IcCreditCard',
            creation_time: '9 o clock',
            id: 'abc12340',
            payment_method: 'credit_debit_card',
            payment_method_identifier: '12345678910111213',
            title: 'Credit / Debit card',
            paragraphs: [
                'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.',
            ],
            input_label: 'Card Number',
        };
    });
    it('should display correct identifier', () => {
        render(
            <ExpandedCard
                card_details={card_details}
                identifier={card_details.payment_method_identifier}
                show_button={[]}
            />
        );
        const element = screen.getByText('Card Number', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should show example link for credit/debit card', () => {
        render(
            <ExpandedCard
                card_details={card_details}
                identifier={card_details.payment_method_identifier}
                show_button={[]}
            />
        );
        const exampelLink = screen.getByText('See example');
        expect(exampelLink).toBeInTheDocument();
    });
    it('should format identifier', () => {
        render(
            <ExpandedCard
                card_details={card_details}
                identifier={card_details.payment_method_identifier}
                show_button={[]}
            />
        );
        const element = screen.getByDisplayValue('1234 56XX XXXX 1121 3', {
            exact: true,
        });
        expect(element).toBeInTheDocument();
    });
});
