import React from 'react';
import { render, screen } from '@testing-library/react';
import ResetTradeDescription from '../reset-trade-description';

describe('<ResetTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<ResetTradeDescription />);

        expect(screen.getByText(/If you select "Reset-Up”, you win the payout/i)).toBeInTheDocument();
    });
});
