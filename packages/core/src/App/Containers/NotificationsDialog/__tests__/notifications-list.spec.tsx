import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import NotificationsList from '../notifications-list';

jest.mock('App/Components/Routes', () => ({ BinaryLink: 'MockedBinaryLink' }));

describe('NotificationsList', () => {
    const renderComponent = (mock_store_override = {}) => {
        const mock_store = mockStore({
            notifications: {
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
                toggleNotificationsModal: jest.fn(),
            },
            ...mock_store_override,
        });
        render(
            <StoreProvider store={mock_store}>
                <NotificationsList />
            </StoreProvider>
        );
    };

    it('should render the notification header', () => {
        renderComponent();
        expect(screen.getByText('Mock Notification Header')).toBeInTheDocument();
    });

    it('should render the notification message', () => {
        renderComponent();
        expect(screen.getByText('Mock Notification Message')).toBeInTheDocument();
    });

    it('should render the notification action button', () => {
        renderComponent();
        expect(screen.getByText('Mock Notification Action')).toBeInTheDocument();
    });
});
