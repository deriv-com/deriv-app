import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { render, screen } from '@testing-library/react';
import TradersHubHomeButton from '../traders-hub-home-button';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({ location: { pathname: '/appstore/traders-hub' } }),
}));

describe('TradersHubHomeButton', () => {
    let store: TStores;
    beforeEach(() => {
        store = mockStore({});
    });

    it("should display the text Trader's Hub in the header", () => {
        render(
            <StoreProvider store={store}>
                <TradersHubHomeButton />
            </StoreProvider>
        );
        expect(screen.getByText("Trader's Hub")).toBeInTheDocument();
    });

    it('should have the --active class if in traders hub route', () => {
        render(
            <StoreProvider store={store}>
                <TradersHubHomeButton />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_home_button')).toHaveClass('trading-hub-header__tradershub--active');
    });
});
