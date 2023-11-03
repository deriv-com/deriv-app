import React from 'react';
import { render, screen } from '@testing-library/react';
import LbCallTradeDescription from '../lb-call-trade-description';

describe('<LbCallTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<LbCallTradeDescription />);

        expect(screen.getByText(/By purchasing the "Close-to-Low" contract/i)).toBeInTheDocument();
    });
});
