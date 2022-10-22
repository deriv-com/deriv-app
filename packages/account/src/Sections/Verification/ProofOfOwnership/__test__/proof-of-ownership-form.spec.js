import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ProofOfOwnershipForm from '../proof-of-ownership-form.jsx';
import test_data from './test-data';
import { act } from 'react-test-renderer';

describe('proof-of-ownership-form.jsx', () => {
    let cards;
    beforeAll(() => {
        cards = test_data;
    });
    it('should render a single card item inside the form', () => {
        render(<ProofOfOwnershipForm cards={[cards.requests[0]]} updateAccountStatus={jest.fn()} />);
        const cardItems = screen.getAllByRole('card-item');
        expect(cardItems.length).toEqual(1);
    });
    it('should render multiple card items inside the form', () => {
        render(<ProofOfOwnershipForm cards={cards.requests} updateAccountStatus={jest.fn()} />);
        const cardItems = screen.getAllByRole('card-item');
        expect(cardItems.length).toEqual(cards.requests.length);
    });
    it('should format identifier', async () => {
        render(<ProofOfOwnershipForm cards={[cards.requests[3]]} updateAccountStatus={jest.fn()} />);
        const poo_dropdown_button = await screen.findByTestId('proof-of-ownership-button');
        fireEvent.click(poo_dropdown_button);
        const identifier_input = await screen.findByTestId('payment_method_identifier');
        act(() => {
            fireEvent.change(identifier_input, { target: { value: '1234567891011121' } });
            fireEvent.blur(identifier_input);
        });
        const element = screen.getByDisplayValue('1234 56XX XXXX 1121', {
            exact: true,
        });
        expect(element).toBeInTheDocument();
    });
});
