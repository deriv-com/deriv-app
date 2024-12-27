import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import TradersHubHomeButton from '../traders-hub-home-button';

jest.mock('react-router', () => {
    return {
        ...jest.requireActual('react-router'),
        useHistory: () => ({ history: {} }),
        useLocation: () => ({ pathname: '/' }),
    };
});

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGrowthbookGetFeatureValue: () => [false, false],
}));

describe('TradersHubHomeButton', () => {
    const mock_store = mockStore({});

    it("should display the text Trader's Hub in the header", () => {
        render(
            <StoreProvider store={mock_store}>
                <TradersHubHomeButton />
            </StoreProvider>
        );
        expect(screen.getByText("Trader's Hub")).toBeInTheDocument();
    });

    it('should have the --active class if in traders hub route', () => {
        render(
            <StoreProvider store={mock_store}>
                <TradersHubHomeButton />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_home_button')).toHaveClass('traders-hub-header__tradershub--active');
    });
});
