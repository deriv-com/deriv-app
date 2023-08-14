import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import ClearAllFooter from '../notifications-clear-all-footer';

describe('ClearAllFooter', () => {
    const mock_store_without_notifications = mockStore({ notifications: { notifications: [] } });
    const mock_store_with_notifications = mockStore({
        notifications: {
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
    const mock_props: React.ComponentProps<typeof ClearAllFooter> = { clearNotifications: jest.fn() };

    it('should render the component', () => {
        render(
            <StoreProvider store={mock_store_without_notifications}>
                <ClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_clear_all_footer_button')).toBeInTheDocument();
    });

    it('should render the button', () => {
        render(
            <StoreProvider store={mock_store_without_notifications}>
                <ClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Clear All' })).toBeInTheDocument();
    });

    it('should render the button in disabled state if there are no notifications', () => {
        render(
            <StoreProvider store={mock_store_without_notifications}>
                <ClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Clear All' })).toBeDisabled();
    });

    it('should render the button in enabled state if there are notifications available', () => {
        render(
            <StoreProvider store={mock_store_with_notifications}>
                <ClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Clear All' })).toBeEnabled();
    });

    it('should fire the "clearNotifications" method on clicking the button', () => {
        render(
            <StoreProvider store={mock_store_with_notifications}>
                <ClearAllFooter {...mock_props} />
            </StoreProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Clear All' }));
        expect(mock_props.clearNotifications).toBeCalledTimes(1);
    });
});
