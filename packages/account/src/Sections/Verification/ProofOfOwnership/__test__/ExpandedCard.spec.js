import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandedCard from '../ExpandedCard.jsx';
import { localize } from '@deriv/translations';

describe('ExpandedCard.jsx', () => {
    let card_details;

    beforeAll(() => {
        card_details = {
            icon: 'IcVisaLight',
            id: '1',
            payment_method: 'VISA',
            payment_method_identifier: '12345678910111213',
            title: 'VISA',
            instructions: [
                localize(
                    'Upload a photo of your card showing your name and card number. Your card number must only show the first 6 and last 4 digits. If your card does not have your name embossed on it, we will require a bank statement that shows your name and card number.'
                ),
            ],
            input_label: localize('Card number'),
            documents_required: 1,
        };
    });
    it('should display correct identifier', () => {
        render(
            <ExpandedCard
                card_details={card_details}
                identifier={card_details.payment_method_identifier}
                show_browse_button={[]}
            />
        );
        const element = screen.getByText('Card number', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should show example link for credit/debit card', () => {
        render(
            <ExpandedCard
                card_details={card_details}
                identifier={card_details.payment_method_identifier}
                show_browse_button={[]}
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
                show_browse_button={[]}
            />
        );
        const element = screen.getByDisplayValue('1234 56XX XXXX 1121 3', {
            exact: true,
        });
        expect(element).toBeInTheDocument();
    });
});
