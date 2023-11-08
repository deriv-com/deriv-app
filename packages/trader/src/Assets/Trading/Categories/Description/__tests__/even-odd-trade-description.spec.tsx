import React from 'react';
import { render, screen } from '@testing-library/react';
import EvenOddTradeDescription from '../even-odd-trade-description';

describe('<EvenOddTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<EvenOddTradeDescription />);

        expect(screen.getByText(/If you select "Even", you will win the payout/i)).toBeInTheDocument();
    });
});
