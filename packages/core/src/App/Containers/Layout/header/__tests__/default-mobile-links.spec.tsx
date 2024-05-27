import React from 'react';
import { render, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DefaultMobileLinks from '../default-mobile-links';
import { routes } from '@deriv/shared';

jest.mock('App/Components/Routes', () => ({
    BinaryLink: jest.fn(() => <div data-testid='dt_binary_link'>MockedBinaryLink to Account Settings</div>),
}));
jest.mock('../show-notifications', () =>
    jest.fn(() => <div data-testid='dt_show_notifications'>MockedShowNotifications</div>)
);
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({ pathname: '' }),
}));

jest.mock('../traders-hub-onboarding', () => jest.fn(() => <div>MockedTradersHubOnboarding</div>));

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    useStore: jest.fn(() => ({ client: { has_wallet: false } })),
}));

describe('DefaultMobileLinks', () => {
    const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
        handleClickCashier: jest.fn(),
    };

    it('should render "DefaultMobileLinks" with Onboarding, Notifications & link to Account Settings for wallet', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: routes.wallets,
        });
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByText('MockedTradersHubOnboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByText('MockedBinaryLink to Account Settings')).toBeInTheDocument();
    });

    it('should render "DefaultMobileLinks" with Notifications & link to Account Settings for non wallet path', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: routes.traders_hub,
        });
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.queryByText('MockedTradersHubOnboarding')).not.toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByText('MockedBinaryLink to Account Settings')).toBeInTheDocument();
    });

    it('should display the cashier button', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
    });

    it('should fire the "handleClickCashier" event on clicking the button', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        userEvent.click(screen.getByRole('button', { name: 'Cashier' }));
        expect(mock_props.handleClickCashier).toHaveBeenCalledTimes(1);
    });
});
