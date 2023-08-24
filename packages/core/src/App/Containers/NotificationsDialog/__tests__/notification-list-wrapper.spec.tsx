import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import NotificationListWrapper from '../notification-list-wrapper';

jest.mock('App/Components/Routes', () => ({ BinaryLink: 'MockedBinaryLink' }));

describe('NotificationListWrapper', () => {
    const mock_store_without_notifications = mockStore({ notifications: { notifications: [] } });
    const mock_store_with_notifications = mockStore({
        notifications: {
            is_notifications_empty: false,
            notifications: [
                {
                    key: 'mock_notification_key',
                    header: 'Mock Notification Header',
                    message: 'Mock Notification Message',
                    action: {
                        route: '/mock/route',
                        text: 'Mock Notification Action',
                    },
                    type: 'mock_notification_type',
                },
            ],
        },
    });
    const renderComponent = (mock_store = mockStore({})) => {
        const mock_props = { clearNotifications: jest.fn() };
        render(
            <StoreProvider store={mock_store}>
                <NotificationListWrapper {...mock_props} />
            </StoreProvider>
        );
    };

    it('should render and display the "NotificationListWrapper" component on screen', () => {
        renderComponent(mock_store_without_notifications);
        expect(screen.getByTestId('dt_notifications_list_wrapper')).toBeInTheDocument();
    });

    it('should render the "EmptyNotification" component if notifications list is empty', () => {
        renderComponent(mock_store_without_notifications);
        expect(screen.getByText('No notifications')).toBeInTheDocument();
        expect(screen.getByText('You have yet to receive any notifications')).toBeInTheDocument();
        expect(screen.queryByText('Mock Notification Header')).not.toBeInTheDocument();
        expect(screen.queryByText('Mock Notification Message')).not.toBeInTheDocument();
        expect(screen.queryByText('Mock Notification Action')).not.toBeInTheDocument();
    });

    it('should render the "NotificationsList" component if notifications list is not empty', () => {
        renderComponent(mock_store_with_notifications);
        expect(screen.getByText('Mock Notification Header')).toBeInTheDocument();
        expect(screen.getByText('Mock Notification Message')).toBeInTheDocument();
        expect(screen.getByText('Mock Notification Action')).toBeInTheDocument();
        expect(screen.queryByText('No notifications')).not.toBeInTheDocument();
        expect(screen.queryByText('You have yet to receive any notifications')).not.toBeInTheDocument();
    });

    it('should render the "NotificationsClearAllFooter" component', () => {
        renderComponent(mock_store_without_notifications);
        expect(screen.getByText('Clear All')).toBeInTheDocument();
    });
});
