import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { WS } from '@deriv/shared';
import TwoFactorAuthentication from '../two-factor-authentication';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            accountSecurity: jest.fn().mockResolvedValue({}),
        },
    },
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => 'mockedLoading'),
}));

jest.mock('qrcode.react', () => jest.fn(() => <div>QRCode</div>));

describe('<TwoFactorAuthentication/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const store = mockStore({
        client: {
            has_enabled_two_fa: false,
            getTwoFAStatus: jest.fn().mockResolvedValue(false),
        },
    });

    const renderComponent = ({ store_config = store }) => {
        render(
            <StoreProvider store={store_config}>
                <TwoFactorAuthentication />
            </StoreProvider>
        );
    };

    it('should render Loader component if is_switching is true', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                is_switching: true,
            },
        };

        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            expect(screen.getByText('mockedLoading')).toBeInTheDocument();
        });
    });

    it('should render LoadErrorMessage component if getTwoFAStatus call returns error object', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                getTwoFAStatus: jest
                    .fn()
                    .mockResolvedValueOnce({ error: { message: 'error while getting 2FA status' } }),
            },
        };

        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            const error_message = screen.getByText(/error while getting 2FA status/i);
            expect(error_message).toBeInTheDocument();
        });
    });

    it('should render LoadErrorMessage component if generate_response call returns error', async () => {
        WS.authorized.accountSecurity.mockResolvedValueOnce({
            error: { message: 'Invalid request error', code: 'InvalidOTP' },
        });

        renderComponent({ store_config: store });

        await waitFor(() => {
            const error_message = screen.getByText(/Invalid request error/i);
            expect(error_message).toBeInTheDocument();
        });
    });

    it('should render TwoFactorDisabled component when has_enabled_two_fa is false', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                has_enabled_two_fa: false,
            },
        };
        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            const setup_title = screen.getByText(/How to set up 2FA for your Deriv account/i);
            expect(setup_title).toBeInTheDocument();
        });
    });

    it('should render TwoFactorEnabled component when has_enabled_two_fa is true', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                has_enabled_two_fa: true,
            },
        };

        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            const enabled_title = screen.getByText(/You have enabled 2FA for your Deriv account./i);
            expect(enabled_title).toBeInTheDocument();
        });
    });
});
