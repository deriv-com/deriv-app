import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import TradersHubOnboarding from '../traders-hub-onboarding';

describe('TradersHubOnboarding', () => {
    it('should render and display the "TradersHubOnboarding" component on screen', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <TradersHubOnboarding />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toBeInTheDocument();
    });

    it('should display the traders hub onboarding icon', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <TradersHubOnboarding />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_onboarding_icon')).toBeInTheDocument();
    });
});
