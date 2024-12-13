import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from '../notification.jsx';

jest.mock('../../../Routes', () => ({
    BinaryLink: 'mockedBinaryLink',
}));

describe('Notification component', () => {
    it('should render the NotificationBanner component when "data.type" is "news"', () => {
        render(<Notification data={{ type: 'news' }} />);
        const element = screen.getByTestId('dt_notification_banner');
        expect(element).toBeInTheDocument();
    });

    it('should render the NotificationBanner component when "data.type" is "trustpilot"', () => {
        render(<Notification data={{ type: 'trustpilot' }} />);
        const element = screen.getByTestId('dt_notification_banner');
        expect(element).toBeInTheDocument();
    });

    it('should render the NotificationPromo component when "data.type" is "promotions"', () => {
        render(<Notification data={{ type: 'promotions' }} />);
        const element = screen.getByTestId('dt_notification_promo');
        expect(element).toBeInTheDocument();
    });

    it('should render the default component when "data.type" is not one of the above', () => {
        render(<Notification data={{ type: 'warning' }} />);
        const element = screen.getByTestId('dt_default_component');
        expect(element).toBeInTheDocument();
    });

    it('should render the "notify_financial_assessment" notification', () => {
        const mock_props = {
            action: {
                route: '/account/financial-assessment',
                text: 'Start now',
            },
            header: 'Pending action required',
            key: 'notify_financial_assessment',
            message: 'Please complete your financial assessment.',
            should_show_again: true,
            type: 'warning',
        };
        render(<Notification data={mock_props} />);
        expect(screen.getByText('Pending action required')).toBeInTheDocument();
        expect(screen.getByText('Please complete your financial assessment.')).toBeInTheDocument();
        expect(screen.getByText('Start now')).toBeInTheDocument();
    });
});
