import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DefaultMobileLinks from '../default-mobile-links';

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

const setWindowLocationToWallets = () => {
    // eslint-disable-next-line no-global-assign
    window = Object.create(window);
    const url = '/wallets';
    Object.defineProperty(window, 'location', {
        value: {
            pathname: url,
        },
        writable: true,
    });
};

const setWindowLocationToAppstoreTradershub = () => {
    // eslint-disable-next-line no-global-assign
    window = Object.create(window);
    const url = '/appstore/tradershub';
    Object.defineProperty(window, 'location', {
        value: {
            pathname: url,
        },
        writable: true,
    });
};

describe('DefaultMobileLinks', () => {
    const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
        handleClickCashier: jest.fn(),
    };

    it('should render "DefaultMobileLinks" with Onboarding, Notifications & link to Account Settings for wallet', () => {
        setWindowLocationToWallets();
        render(<DefaultMobileLinks {...mock_props} />);
        expect(window.location.pathname).toEqual(url);
        expect(screen.getByText('MockedTradersHubOnboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByText('MockedBinaryLink to Account Settings')).toBeInTheDocument();
    });

    it('should render "DefaultMobileLinks" with Notifications & link to Account Settings for non wallet path', () => {
        setWindowLocationToAppstoreTradershub();
        expect(window.location.pathname).toEqual('/appstore/tradershub');
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
