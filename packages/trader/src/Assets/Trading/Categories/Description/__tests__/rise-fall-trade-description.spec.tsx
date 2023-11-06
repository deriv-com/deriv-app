import React from 'react';
import { render, screen } from '@testing-library/react';
import RiseFallTradeDescription from '../rise-fall-trade-description';

describe('<RiseFallTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<RiseFallTradeDescription />);

        expect(screen.getByText(/If you select "Rise", you win the payout if the exit/i)).toBeInTheDocument();
    });
});
