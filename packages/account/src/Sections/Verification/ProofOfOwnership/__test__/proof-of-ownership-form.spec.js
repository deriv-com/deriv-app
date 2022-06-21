import { render, screen } from '@testing-library/react';
import React from 'react';
import ProofOfOwnershipForm from '../proof-of-ownership-form.jsx';
import testData from './test-data';

describe('proof-of-ownership-form.jsx', () => {
    let cards;
    beforeAll(() => {
        cards = testData;
    });
    it('should render a single card item inside the form', () => {
        render(<ProofOfOwnershipForm cards={[cards.requests[0]]} handleSubmit={jest.fn()} />);
        const cardItems = screen.getAllByRole('card-item');
        expect(cardItems.length).toEqual(1);
    });
    it('should render multiple card items inside the form', () => {
        render(<ProofOfOwnershipForm cards={cards.requests} handleSubmit={jest.fn()} />);
        const cardItems = screen.getAllByRole('card-item');
        expect(cardItems.length).toEqual(cards.requests.length);
    });
});
