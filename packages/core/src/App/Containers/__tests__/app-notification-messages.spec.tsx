import React from 'react';
import { render, screen } from '@testing-library/react';
import AppNotificationMessages from '../app-notification-messages';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({
        pathname: '/appstore/traders-hub',
    })),
}));
jest.mock('react-transition-group', () => ({
    TransitionGroup: jest.fn(({ children }) => <div>{children}</div>),
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('../../Components/Elements/NotificationMessage', () => jest.fn(() => 'mockedNotification'));
jest.mock('../trade-notifications', () => jest.fn(() => <div>TradeNotifications</div>));

describe('AppNotificationMessages', () => {
    it('should render the component', () => {
        const mock_props = {
            marked_notifications: [],
            notification_messages: [
                {
                    action: {
                        route: '/account/financial-assessment',
                        text: 'Start now',
                    },
                    header: 'Pending action required',
                    key: 'notify_financial_assessment',
                    message: 'Please complete your financial assessment.',
                    should_show_again: true,
                    type: 'warning',
                },
            ],
            landing_company_shortcode: 'svg',
            has_iom_account: false,
            has_malta_account: false,
            is_logged_in: true,
            should_show_popups: true,
        };
        render(<AppNotificationMessages {...mock_props} />);
        expect(screen.getByText('mockedNotification')).toBeInTheDocument();
        expect(screen.getByText('TradeNotifications')).toBeInTheDocument();
    });
});
