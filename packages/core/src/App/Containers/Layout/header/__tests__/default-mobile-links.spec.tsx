import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DefaultMobileLinks from '../default-mobile-links';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('App/Components/Routes', () => ({
    BinaryLink: jest.fn(() => <div data-testid='dt_binary_link'>MockedBinaryLink to Account Settings</div>),
}));
jest.mock('../show-notifications', () =>
    jest.fn(() => <div data-testid='dt_show_notifications'>MockedShowNotifications</div>)
);

jest.mock('../traders-hub-onboarding', () =>
    jest.fn(() => <div data-testid='dt_traders_hub_onboarding'>MockedTradersHubOnboarding</div>)
);

describe('DefaultMobileLinks', () => {
    const store = mockStore({
        client: {
            has_wallet: false,
        },
    });
    const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
        handleClickCashier: jest.fn(),
    };
    const renderComponent = (modified_store = store) =>
        render(
            <StoreProvider store={modified_store}>
                <DefaultMobileLinks {...mock_props} />
            </StoreProvider>
        );
    it('should render "DefaultMobileLinks" with Onboarding, Notifications & link to Account Settings', () => {
        renderComponent();
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedTradersHubOnboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByText('MockedBinaryLink to Account Settings')).toBeInTheDocument();
    });

    it('should display the cashier button', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
    });

    it('should fire the "handleClickCashier" event on clicking the button', () => {
        renderComponent();
        userEvent.click(screen.getByRole('button', { name: 'Cashier' }));
        expect(mock_props.handleClickCashier).toHaveBeenCalledTimes(1);
    });
});
