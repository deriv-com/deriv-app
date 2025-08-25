import React from 'react';
import { render, screen } from '@testing-library/react';
import OverUnderTradeDescription from '../over-under-trade-description';

describe('<OverUnderTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<OverUnderTradeDescription />);

        expect(
            screen.getByText(/Earn a payout if the last digit of the exit spot is less than your chosen number/i)
        ).toBeInTheDocument();
    });
});
