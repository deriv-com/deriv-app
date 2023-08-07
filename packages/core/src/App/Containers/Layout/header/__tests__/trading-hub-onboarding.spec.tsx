import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { render, screen } from '@testing-library/react';
import TradingHubOnboarding from '../trading-hub-onboarding';

describe('TradingHubOnboarding', () => {
    let store: TStores;
    beforeEach(() => {
        store = mockStore({});
    });

    it('should render the component', () => {
        render(
            <StoreProvider store={store}>
                <TradingHubOnboarding />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_trading_hub_onboarding')).toBeInTheDocument();
        expect(screen.getByTestId('dt_trading_hub_onboarding')).toHaveClass(
            'trading-hub-header__tradinghub--onboarding'
        );
    });

    it('should display the trading hub onboarding icon', () => {
        render(
            <StoreProvider store={store}>
                <TradingHubOnboarding />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_trading_hub_onboarding_icon')).toBeInTheDocument();
    });
});
