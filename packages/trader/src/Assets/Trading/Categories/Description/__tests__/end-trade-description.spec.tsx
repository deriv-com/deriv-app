import React from 'react';
import { render, screen } from '@testing-library/react';
import EndTradeDescription from '../end-trade-description';

describe('<EndTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<EndTradeDescription />);

        expect(screen.getByText(/If you select "Ends Between", you win the payout/i)).toBeInTheDocument();
    });
});
