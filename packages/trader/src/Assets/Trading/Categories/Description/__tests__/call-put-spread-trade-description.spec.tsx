import React from 'react';
import { render, screen } from '@testing-library/react';
import CallPutSpreadTradeDescription from '../call-put-spread-trade-description';

describe('<CallPutSpreadTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<CallPutSpreadTradeDescription />);

        expect(screen.getByText(/Win maximum payout if the exit spot is higher/i)).toBeInTheDocument();
    });
});
