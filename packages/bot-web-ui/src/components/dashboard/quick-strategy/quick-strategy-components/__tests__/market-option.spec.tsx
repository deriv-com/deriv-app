import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketOption from '../market-option';

describe('MarketOption', () => {
    const symbol = {
        value: '1HZ10V',
        text: 'Volatility 10 Index',
        group: 'Volatility Indices',
    };

    it('should render MarketOption', () => {
        const { container } = render(<MarketOption symbol={symbol} />);

        expect(container).toBeInTheDocument();
        expect(screen.getByText('Volatility 10 Index')).toBeInTheDocument();
        expect(screen.getByTestId('dt_symbol_icon')).toBeInTheDocument();
    });
});
