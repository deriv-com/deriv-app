import React from 'react';
import { render, screen } from '@testing-library/react';
import OverUnderTradeDescription from '../over-under-trade-description';

describe('<OverUnderTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<OverUnderTradeDescription />);

        expect(screen.getByText(/If you select "Over", you will win the payout/i)).toBeInTheDocument();
    });
});
