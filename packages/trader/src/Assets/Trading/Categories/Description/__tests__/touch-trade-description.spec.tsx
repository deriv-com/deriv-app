import React from 'react';
import { render, screen } from '@testing-library/react';
import TouchTradeDescription from '../touch-trade-description';

describe('<TouchTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<TouchTradeDescription />);

        expect(screen.getByText(/If you select "Touch", you win the payout/i)).toBeInTheDocument();
    });
});
