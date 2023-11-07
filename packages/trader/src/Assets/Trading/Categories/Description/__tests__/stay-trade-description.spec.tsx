import React from 'react';
import { render, screen } from '@testing-library/react';
import StayTradeDescription from '../stay-trade-description';

describe('<StayTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<StayTradeDescription />);

        expect(screen.getByText(/If you select "Stays Between", you win the payout/i)).toBeInTheDocument();
    });
});
