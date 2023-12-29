import React from 'react';
import { render, screen } from '@testing-library/react';
import TickHighLowTradeDescription from '../tick-high-low-trade-description';

describe('<TickHighLowTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<TickHighLowTradeDescription />);

        expect(screen.getByText(/If you select "High Tick", you win the payout/i)).toBeInTheDocument();
    });
});
