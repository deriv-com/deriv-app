import React from 'react';
import { render, screen } from '@testing-library/react';
import { TurbosTradeDescription } from '../turbos-trade-description';

describe('<TurbosTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<TurbosTradeDescription />);
        expect(screen.getByText(/Barrier is the level where if the spot price crosses this/i)).toBeInTheDocument();
    });
});
