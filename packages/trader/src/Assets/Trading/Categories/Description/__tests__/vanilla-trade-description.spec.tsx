import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VanillaTradeDescription from '../vanilla-trade-description';

const mocked_props = {
    onClick: jest.fn(),
};

describe('<VanillaTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<VanillaTradeDescription />);

        expect(screen.getByText(/Vanillas allow you to predict if the underlying asset/i)).toBeInTheDocument();
    });
});
