import React from 'react';
import { render, screen } from '@testing-library/react';
import TurbosTradeDescription from '../turbos-trade-description';

describe('<TurbosTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<TurbosTradeDescription onClick={jest.fn()} />);

        expect(
            screen.getByText(/Turbo options allow you to predict the direction of the underlying asset’s movements./i)
        ).toBeInTheDocument();
    });
});
