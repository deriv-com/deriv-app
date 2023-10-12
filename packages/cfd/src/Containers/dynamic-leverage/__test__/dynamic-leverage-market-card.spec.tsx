import React from 'react';
import { render, screen } from '@testing-library/react';
import { DynamicLeverageMarketCard } from '../dynamic-leverage-market-card';

describe('DynamicLeverageMarketCard', () => {
    const mock_props = {
        title: 'Metals',
        description: '(XAUUSD, XAGUSD)',
        leverage: 'Up to 1:1000',
        data: [
            { from: 0.01, to: 1, leverage: 1000 },
            { from: 101, to: 500, leverage: 1000 },
            { from: 501, to: 1000, leverage: 500 },
        ],
    };

    it('should render DynamicLeverageMarketCard header properly', () => {
        render(<DynamicLeverageMarketCard {...mock_props} />);

        const market_title = screen.getByTestId('market_title');
        const leverage_title = screen.getByTestId('leverage_title');
        const description = screen.getByTestId('description_title');
        expect(market_title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(leverage_title).toBeInTheDocument();
        expect(market_title).toHaveTextContent('Metals');
        expect(description).toHaveTextContent('(XAUUSD, XAGUSD)');
        expect(leverage_title).toHaveTextContent('Up to 1:1000');
    });

    it('should not render description if not present', () => {
        const props = {
            title: 'Forex',
            leverage: 'Up to 1:1000',
            data: [
                {
                    from: 0.01,
                    to: 1,
                    leverage: 1000,
                },
            ],
        };
        render(<DynamicLeverageMarketCard {...props} />);
        const market_title = screen.getByTestId('market_title');
        const leverage_title = screen.getByTestId('leverage_title');
        const description = screen.queryByTestId('description_title');
        expect(market_title).toBeInTheDocument();
        expect(description).not.toBeInTheDocument();
        expect(leverage_title).toBeInTheDocument();
    });

    it('should render dynamic leverages correctly', () => {
        render(<DynamicLeverageMarketCard {...mock_props} />);

        const market_table = screen.getByRole('table');
        expect(market_table).toBeInTheDocument();

        const table_headers = screen.getAllByRole('columnheader');
        const [from_header, to_header, leverage_header] = table_headers;

        expect(from_header).toHaveTextContent('From');
        expect(to_header).toHaveTextContent('to');
        expect(leverage_header).toHaveTextContent('Leverage');

        const table_rows = screen.getAllByRole('row');
        const [header_row, ...data_rows] = table_rows;
        expect(header_row).toHaveClass('dynamic-leverage-modal__market-table-header-row');
        expect(data_rows).toHaveLength(3);
    });
});
