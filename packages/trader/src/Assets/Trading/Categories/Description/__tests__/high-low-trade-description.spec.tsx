import React from 'react';
import { render, screen } from '@testing-library/react';
import HighLowTradeDescription from '../high-low-trade-description';

describe('<HighLowTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<HighLowTradeDescription />);

        expect(screen.getByText(/If you select "Higher", you win the payout/i)).toBeInTheDocument();
    });
});
