import React from 'react';
import { render, screen } from '@testing-library/react';
import EvenOddTradeDescription from '../even-odd-trade-description';

describe('<EvenOddTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<EvenOddTradeDescription />);

        expect(screen.getByText(/lets you predict if the last digit of the last tick’s price/i)).toBeInTheDocument();
    });
});
