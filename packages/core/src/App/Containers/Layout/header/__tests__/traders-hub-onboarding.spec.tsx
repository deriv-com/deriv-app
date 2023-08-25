import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { render, screen } from '@testing-library/react';
import TradersHubOnboarding from '../traders-hub-onboarding';

describe('TradersHubOnboarding', () => {
    let store: TStores;
    beforeEach(() => {
        store = mockStore({});
    });

    it('should render and display the "TradersHubOnboarding" component on screen', () => {
        render(
            <StoreProvider store={store}>
                <TradersHubOnboarding />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toBeInTheDocument();
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toHaveClass(
            'trading-hub-header__tradershub--onboarding'
        );
    });

    it('should display the trading hub onboarding icon', () => {
        render(
            <StoreProvider store={store}>
                <TradersHubOnboarding />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_onboarding_icon')).toBeInTheDocument();
    });
});
