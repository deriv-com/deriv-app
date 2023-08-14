import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import NotificationsDialog from '../notifications-dialog';

jest.mock('react-transition-group', () => ({ CSSTransition: () => 'MockedCSSTransition' }));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileDialog: () => 'MockedMobileDialog',
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('NotificationsDialog', () => {
    const renderComponent = (mock_store_override = {}) => {
        const mock_store = mockStore({
            notifications: {
                is_notifications_visible: true,
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
                <NotificationsDialog />
            </StoreProvider>
        );
    };

    it('should render the component CSSTranition in desktop mode', () => {
        renderComponent();
        expect(screen.getByText('MockedCSSTransition')).toBeInTheDocument();
        expect(screen.queryByText('MockedMobileDialog')).not.toBeInTheDocument();
    });

    it('should render the component MobileDialog in mobile mode', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        renderComponent();
        expect(screen.getByText('MockedMobileDialog')).toBeInTheDocument();
        expect(screen.queryByText('MockedCSSTransition')).not.toBeInTheDocument();
    });
});
