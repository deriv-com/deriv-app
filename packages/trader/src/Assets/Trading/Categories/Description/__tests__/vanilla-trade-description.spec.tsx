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

    it('should call a function if word from vocabulary was clicked', () => {
        render(<VanillaTradeDescription {...mocked_props} />);

        const vocabulary_word = screen.getByText(/payout per point/i);
        userEvent.click(vocabulary_word);

        expect(mocked_props.onClick).toBeCalled();
    });
});
