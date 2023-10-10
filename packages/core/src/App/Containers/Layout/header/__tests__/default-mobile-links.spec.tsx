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
// eslint-disable-next-line react/display-name
jest.mock('App/Components/Routes', () => () => <div data-testid='dt_binary_link'>MockedBinaryLink</div>);
// eslint-disable-next-line react/display-name
jest.mock('../show-notifications', () => () => <div data-testid='dt_show_notifications'>MockedShowNotifications</div>);
// eslint-disable-next-line react/display-name
jest.mock('../traders-hub-onboarding', () => () => (
    <div data-testid='dt_traders_hub_onboarding'>MockedTradersHubOnboarding</div>
));

describe('DefaultMobileLinks', () => {
    const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
        handleClickCashier: jest.fn(),
    };

    it('should render and display the "DefaultMobileLinks" component on screen', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toBeInTheDocument();
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
