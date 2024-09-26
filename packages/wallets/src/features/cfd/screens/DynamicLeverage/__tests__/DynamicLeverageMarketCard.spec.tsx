import React from 'react';
import { render, screen } from '@testing-library/react';
import { DynamicLeverageMarketCard } from '../DynamicLeverageMarketCard';

jest.mock('../DynamicLeverageTableColumnHeader', () => ({
    DynamicLeverageTableColumnHeader: ({ subtitle, title }: { subtitle: string; title: string }) => (
        <div data-testid='dt_dynamic_leverage_column_header'>
            <span>{title}</span>
            <span>{subtitle}</span>
        </div>
    ),
}));

describe('DynamicLeverageMarketCard', () => {
    const mockProps = {
        data: [
            { from: 2, leverage: 800, to: 5 },
            { from: 4, leverage: 400, to: 6 },
        ],
        displayName: 'Test Market',
        instruments: ['EURUSD', 'GBPUSD'],
        max: 1000,
        min: 100,
    };

    it('displays the title, instruments and leverage when provided', () => {
        render(<DynamicLeverageMarketCard {...mockProps} />);

        expect(screen.getByText('Test Market')).toBeInTheDocument();
        expect(screen.getByText('(EURUSD, GBPUSD)')).toBeInTheDocument();
        expect(screen.getByText('Up to 100:1000')).toBeInTheDocument();
    });

    it('does not display instruments when the array is empty', () => {
        const propsWithoutInstruments = { ...mockProps, instruments: [] };
        render(<DynamicLeverageMarketCard {...propsWithoutInstruments} />);

        expect(screen.queryByTestId('dt_dynamic_leverage_description_title')).not.toBeInTheDocument();
    });

    it('renders the correct number of table headers', () => {
        render(<DynamicLeverageMarketCard {...mockProps} />);

        const headers = screen.getAllByTestId('dt_dynamic_leverage_column_header');
        expect(headers).toHaveLength(3);
    });

    it('renders the correct number and content of data rows', () => {
        render(<DynamicLeverageMarketCard {...mockProps} />);

        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('800')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('400')).toBeInTheDocument();

        const rows = screen.getAllByText(/2|4|5|6|600|800/);
        expect(rows).toHaveLength(6);
    });

    it('handles empty data array', () => {
        const propsWithEmptyData = { ...mockProps, data: [] };
        render(<DynamicLeverageMarketCard {...propsWithEmptyData} />);

        expect(screen.queryByText(/2|4|5|6|400|800/)).not.toBeInTheDocument();
    });
});
