import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationsClearAllFooter from '../notifications-clear-all-footer';

describe('NotificationsClearAllFooter', () => {
    const mock_store_without_notifications = mockStore({ notifications: { notifications: [] } });
    const mock_store_with_notifications = mockStore({
        notifications: {
            is_notifications_empty: false,
            notifications: [
                {
                    key: 'mock_security_notification',
                    header: 'Stronger security for your Deriv account',
                    message:
                        'With two-factor authentication, you’ll protect your account with both your password and your phone - so only you can access your account, even if someone knows your password.',
                    action: {
                        route: '/account/two-factor-authentication',
                        text: 'Secure my account',
                    },
                    type: 'warning',
                },
            ],
        },
    });
    const mock_props: React.ComponentProps<typeof NotificationsClearAllFooter> = { clearNotifications: jest.fn() };

    it('should render and display the "NotificationsClearAllFooter" component on screen', () => {
        render(
            <StoreProvider store={mock_store_without_notifications}>
                <NotificationsClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_clear_all_footer_button')).toBeInTheDocument();
    });

    it('should render the "Clear All" button', () => {
        render(
            <StoreProvider store={mock_store_without_notifications}>
                <NotificationsClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Clear All' })).toBeInTheDocument();
    });

    it('should render the button in disabled state if there are no notifications', () => {
        render(
            <StoreProvider store={mock_store_without_notifications}>
                <NotificationsClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Clear All' })).toBeDisabled();
    });

    it('should render the button in enabled state if there are notifications available', () => {
        render(
            <StoreProvider store={mock_store_with_notifications}>
                <NotificationsClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Clear All' })).toBeEnabled();
    });

    it('should fire the "clearNotifications" method on clicking the button', () => {
        render(
            <StoreProvider store={mock_store_with_notifications}>
                <NotificationsClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        userEvent.click(screen.getByRole('button', { name: 'Clear All' }));
        expect(mock_props.clearNotifications).toBeCalledTimes(1);
    });
});
