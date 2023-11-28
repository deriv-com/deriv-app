import React from 'react';
import { render, screen } from '@testing-library/react';
import RunHighLowTradeDescription from '../run-high-low-trade-description';

describe('<RunHighLowTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<RunHighLowTradeDescription />);

        expect(screen.getByText(/If you select "Only Ups", you win the payout if consecutive/i)).toBeInTheDocument();
    });
});
