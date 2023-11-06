import React from 'react';
import { render, screen } from '@testing-library/react';
import LbHighLowTradeDescription from '../lb-high-low-trade-description';

describe('<LbHighLowTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<LbHighLowTradeDescription />);

        expect(screen.getByText(/By purchasing the "High-to-Low" contract, you/i)).toBeInTheDocument();
    });
});
