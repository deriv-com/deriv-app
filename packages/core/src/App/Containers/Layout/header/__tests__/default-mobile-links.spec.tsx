import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DefaultMobileLinks from '../default-mobile-links';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Popover: () => <div>mockedPopover</div>,
    };
});
jest.mock('App/Components/Routes', () => jest.fn(() => 'MockedBinaryLink'));
jest.mock('../show-notifications', () => jest.fn(() => 'MockedShowNotifications'));
jest.mock('../traders-hub-onboarding', () => jest.fn(() => 'MockedTradersHubOnboarding'));

describe('DefaultMobileLinks', () => {
    const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
        handleClickCashier: jest.fn(),
    };

    it('should render and display the "DefaultMobileLinks" component on screen', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByText('MockedTradersHubOnboarding')).toBeInTheDocument();
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
