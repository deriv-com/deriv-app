import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandedCard from '../ExpandedCard.jsx';

const formatIdentifier = (id, type) => {
    let formattedID = id;
    if (type === 'IcCreditCard' || type === 'IcStockVisa' || type === 'IcStockMasterCard')
        formattedID = `${id.substr(0, 6)}XXXXXX${id.substr(12)}`;
    else if (type === 'IcEwallet') return formattedID;
    return formattedID
        .replace(/\s/g, '')
        .replace(/(\w{4})/g, '$1 ')
        .trim();
};

describe('ExpandedCard.jsx', () => {
    let cardDetails;

    beforeAll(() => {
        cardDetails = {
            icon: 'IcCreditCard',
            creation_time: '9 o clock',
            id: 'abc12340',
            payment_method: 'credit_debit_card',
            payment_method_identifier: 'credit_debit_card',
            title: 'Credit / Debit card',
            paragraphs: [
                'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.',
            ],
            input_label: 'Card Number',
        };
    });
    it('should display correct identifier', () => {
        render(<ExpandedCard card_details={cardDetails} identifier={cardDetails.payment_method_identifier} />);
        const element = screen.getByText('Card Number', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should show example link for credit/debit card', () => {
        render(<ExpandedCard card_details={cardDetails} identifier={cardDetails.payment_method_identifier} />);
        const exampelLink = screen.getByText('See example');
        expect(exampelLink).toBeInTheDocument();
    });
    it('should format identifier', () => {
        render(<ExpandedCard card_details={cardDetails} identifier={cardDetails.payment_method_identifier} />);
        const element = screen.getByDisplayValue(
            formatIdentifier(cardDetails.payment_method_identifier, cardDetails.icon),
            {
                exact: true,
            }
        );
        expect(element).toBeInTheDocument();
    });
});
