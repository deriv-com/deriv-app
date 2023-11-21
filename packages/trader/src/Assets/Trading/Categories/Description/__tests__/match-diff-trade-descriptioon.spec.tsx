import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchDiffTradeDescription from '../match-diff-trade-description';

describe('<MatchDiffTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<MatchDiffTradeDescription />);

        expect(screen.getByText(/If you select "Matches", you will win the payout/i)).toBeInTheDocument();
    });
});
