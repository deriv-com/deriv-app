import React from 'react';
import { render, screen } from '@testing-library/react';
import AsianTradeDescription from '../asian-trade-description';

describe('<AsianTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<AsianTradeDescription />);

        expect(screen.getByText(/Asian options settle by comparing/i)).toBeInTheDocument();
    });
});
