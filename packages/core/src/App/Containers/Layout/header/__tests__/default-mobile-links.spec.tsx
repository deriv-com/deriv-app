import React from 'react';
import { render, screen } from '@testing-library/react';
import DefaultMobileLinks from '../default-mobile-links';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Popover: () => <div>mockedPopover</div>,
    };
});
jest.mock('App/Components/Routes', () => jest.fn(() => 'mockedBinaryLink'));
jest.mock('../show-notifications', () => jest.fn(() => 'mockedShowNotifications'));
jest.mock('../trading-hub-onboarding', () => jest.fn(() => 'mockedTradingHubOnboarding'));

describe('DefaultMobileLinks', () => {
    it('should render the component', () => {
        const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
            handleClickCashier: jest.fn(),
        };
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByText('mockedTradingHubOnboarding')).toBeInTheDocument();
    });

    it('should display the cashier button', () => {
        const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
            handleClickCashier: jest.fn(),
        };
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByText('Cashier')).toBeInTheDocument();
    });
});
