import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from '../notification.jsx';

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

    it('should render the NotificationCloseMxMlt component when "data.type" is "close_mx_mlt"', () => {
        render(<Notification data={{ type: 'close_mx_mlt' }} />);
        const element = screen.getByTestId('dt_notification_close_mx_mlt');
        expect(element).toBeInTheDocument();
    });

    it('should render the NotificationPromo component when "data.type" is "promotions"', () => {
        render(<Notification data={{ type: 'promotions' }} />);
        const element = screen.getByTestId('dt_notification_promo');
        expect(element).toBeInTheDocument();
    });

    it('should render the NotificationOrder component when "data.type" is "p2p_completed_order"', () => {
        render(<Notification data={{ type: 'p2p_completed_order' }} />);
        const element = screen.getByTestId('dt_notification_order');
        expect(element).toBeInTheDocument();
    });

    it('should render the default component when "data.type" is not one of the above', () => {
        render(<Notification data={{ type: 'warning' }} />);
        const element = screen.getByTestId('dt_default_component');
        expect(element).toBeInTheDocument();
    });
});
