import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import NotificationsDialog from '../notifications-dialog';
import { useDevice } from '@deriv-com/ui';

jest.mock('react-transition-group', () => ({ CSSTransition: () => 'MockedCSSTransition' }));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileDialog: () => 'MockedMobileDialog',
}));
jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isMobile: false })),
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
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        renderComponent();
        expect(screen.getByText('MockedMobileDialog')).toBeInTheDocument();
        expect(screen.queryByText('MockedCSSTransition')).not.toBeInTheDocument();
    });
});
