import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { ActiveSymbols } from '@deriv/api-types';
import MarketCountdownTimer from '../market-countdown-timer';
import TraderProviders from '../../../../trader-providers';

const mock_default_props = {
    is_main_page: false,
    setIsTimerLoading: jest.fn(),
    onMarketOpen: jest.fn(),
    symbol: 'WLDAUD',
};

const default_mock_store = {
    modules: {
        trade: {
            active_symbols: [
                {
                    allow_forward_starting: 0,
                    display_name: 'AUD Basket',
                    display_order: 26,
                    exchange_is_open: 1,
                    is_trading_suspended: 0,
                    market: 'synthetic_index',
                    market_display_name: 'Derived',
                    pip: 0.001,
                    subgroup: 'baskets',
                    subgroup_display_name: 'Baskets',
                    submarket: 'forex_basket',
                    submarket_display_name: 'Forex Basket',
                    symbol: 'WLDAUD',
                    symbol_type: 'forex_basket',
                },
            ] as ActiveSymbols,
        },
    },
};

describe('<MarketCountdownTimer />', () => {
    const mockMarketCountdownTimer = (
        mocked_store: TCoreStores,
        mock_props: React.ComponentProps<typeof MarketCountdownTimer>
    ) => {
        return (
            <TraderProviders store={mocked_store}>
                <MarketCountdownTimer {...mock_props} />
            </TraderProviders>
        );
    };

    it('should not render component with children if hen_market_opens && timer_components are equal to false', () => {
        const new_props = { ...mock_default_props };
        new_props.is_main_page = true;
        const { container } = render(mockMarketCountdownTimer(mockStore(default_mock_store), new_props));

        expect(container).toBeEmptyDOMElement();
    });
    // it('should not render component with children if hen_market_opens && timer_components are equal to false', () => {
    //     const { container } = render(mockMarketCountdownTimer(mockStore(default_mock_store), mock_default_props));
    //     screen.debug();

    //     // expect(screen.getByText('It will reopen at')).toBeInTheDocument();
    //     // expect(screen.getByText('Please come back in')).toBeInTheDocument();
    // });
});
