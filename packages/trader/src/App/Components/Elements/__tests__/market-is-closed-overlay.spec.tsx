import React from 'react';
import { act, render, screen } from '@testing-library/react';
import MarketIsClosedOverlay from '../market-is-closed-overlay';

const mock_default_props = {
    is_eu: false,
    is_synthetics_trading_market_available: true,
    onClick: jest.fn(),
    onMarketOpen: jest.fn(),
    symbol: 'test_symbol',
};
const default_button_text = 'Try Synthetic Indices';

jest.mock('../market-countdown-timer', () => jest.fn(() => <div>MarketCountdownTimer</div>));

describe('<MarketIsClosedOverlay />', () => {
    it('should render component with children', async () => {
        await act(async () => {
            render(<MarketIsClosedOverlay {...mock_default_props} />);
        });

        expect(screen.getByText('This market is closed')).toBeInTheDocument();
        expect(screen.getByText('MarketCountdownTimer')).toBeInTheDocument();
        expect(screen.getByText(/In the meantime, try our synthetic indices/i)).toBeInTheDocument();
        expect(screen.getByText(default_button_text)).toBeInTheDocument();
    });

    it('should render no message and another button text if is_synthetics_trading_market_available is false', () => {
        render(<MarketIsClosedOverlay {...mock_default_props} is_synthetics_trading_market_available={false} />);

        expect(screen.queryByText(/In the meantime, try our synthetic indices/i)).not.toBeInTheDocument();
        expect(screen.getByText('See open markets')).toBeInTheDocument();
    });

    it('should render default button text if is_eu && is_synthetics_trading_market_available are equal to true', () => {
        render(<MarketIsClosedOverlay {...mock_default_props} is_eu />);

        expect(screen.getByText(default_button_text)).toBeInTheDocument();
    });
});
