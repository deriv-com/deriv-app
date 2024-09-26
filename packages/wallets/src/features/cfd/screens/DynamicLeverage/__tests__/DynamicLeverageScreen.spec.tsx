import React from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { useDynamicLeverage } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { useDynamicLeverageModalState } from '../../../components/DynamicLeverageContext';
import DynamicLeverageScreen from '../DynamicLeverageScreen';

jest.mock('usehooks-ts', () => ({
    useDebounceValue: jest.fn(() => [false]),
}));

jest.mock('@deriv/api-v2', () => ({
    useDynamicLeverage: jest.fn(() => ({
        data: {
            cryptocurrencies: {
                display_name: 'Cryptocurrencies',
                instruments: ['BTC/USD'],
                max: 500,
                min: 25,
                volume: { data: [] },
            },
            forex: {
                display_name: 'Forex',
                instruments: ['EUR/USD'],
                max: 1500,
                min: 100,
                volume: { data: [] },
            },
            metals: {
                display_name: 'Metals',
                instruments: ['Gold'],
                max: 1000,
                min: 50,
                volume: { data: [] },
            },
            stock_indices: {
                display_name: 'Stock Indices',
                instruments: ['US30'],
                max: 200,
                min: 10,
                volume: { data: [] },
            },
        },
    })),
}));

jest.mock('../../../components/DynamicLeverageContext', () => ({
    useDynamicLeverageModalState: jest.fn(() => ({
        isDynamicLeverageVisible: true,
    })),
}));

jest.mock('../DynamicLeverageMarketCard', () => ({
    DynamicLeverageMarketCard: ({ displayName }: { displayName: string }) => (
        <div data-testid='dt_dynamic_leverage_market_card'>{displayName}</div>
    ),
}));

describe('DynamicLeverageScreen', () => {
    it('renders content of dynamic leverage screen', () => {
        render(<DynamicLeverageScreen />);

        expect(screen.getByText(/Enjoy dynamic leverage/)).toBeInTheDocument();
        expect(screen.getByText('up to 1:1500')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_dynamic_leverage_market_card')[0]).toBeInTheDocument();
    });

    it('renders all market cards with correct content', () => {
        render(<DynamicLeverageScreen />);

        const marketCards = screen.getAllByTestId('dt_dynamic_leverage_market_card');
        expect(marketCards).toHaveLength(4);
        expect(marketCards[0]).toHaveTextContent('Forex');
        expect(marketCards[1]).toHaveTextContent('Metals');
        expect(marketCards[2]).toHaveTextContent('Cryptocurrencies');
        expect(marketCards[3]).toHaveTextContent('Stock Indices');
    });

    it('applies correct styling based on visibility', () => {
        const { rerender } = render(<DynamicLeverageScreen />);

        expect(screen.getByTestId('dt_dynamic_leverage_container')).toHaveClass(
            'wallets-dynamic-leverage-screen__container--flip'
        );

        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: false,
        });
        rerender(<DynamicLeverageScreen />);

        expect(screen.queryByTestId('dt_dynamic_leverage_container')).not.toHaveClass(
            'wallets-dynamic-leverage-screen__container--flip'
        );
    });

    it('applies hidden class when not visible and debounced', () => {
        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: false,
        });
        (useDebounceValue as jest.Mock).mockReturnValue([true]);

        render(<DynamicLeverageScreen />);

        expect(screen.getByTestId('dt_dynamic_leverage_container')).toHaveClass(
            'wallets-dynamic-leverage-screen__container--hidden'
        );
    });

    it('returns null when dynamic leverage is not available', () => {
        (useDynamicLeverage as jest.Mock).mockReturnValue({
            data: null,
        });
        render(<DynamicLeverageScreen />);

        expect(screen.queryByTestId('dt_dynamic_leverage_container')).not.toBeInTheDocument();
    });
});
