import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VanillaTradeDescription from '../vanilla-trade-description';

const mocked_props = {
    onClick: jest.fn(),
};

describe('<VanillaTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<VanillaTradeDescription {...mocked_props} />);

        expect(screen.getByText(/Vanilla options allow you to predict/i)).toBeInTheDocument();
    });

    it('specific text of description should be rendered if is_vanilla_fx is true', () => {
        render(<VanillaTradeDescription {...mocked_props} is_vanilla_fx />);

        expect(screen.getByText(/payout per pip/i)).toBeInTheDocument();
        expect(screen.getByText(/You may sell the contract up to 24 hours before expiry/i)).toBeInTheDocument();
    });

    it('should call a function if word from vocabulary was clicked', () => {
        render(<VanillaTradeDescription {...mocked_props} />);

        const glossary_word = screen.getByText(/payout per point/i);
        userEvent.click(glossary_word);

        expect(mocked_props.onClick).toBeCalled();
    });
});
