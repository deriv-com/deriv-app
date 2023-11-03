import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { APIProvider, useGetSecretKey, useGetTwoFa } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import TwoFactorAuthentication from '../two-factor-authentication';

jest.mock('@deriv/api', () => {
    return {
        ...jest.requireActual('@deriv/api'),
        useGetTwoFa: jest.fn(() => ({
            is_TwoFA_enabled: false,
            isLoading: false,
            isSuccess: true,
            getTwoFA: jest.fn(),
        })),
        useGetSecretKey: jest.fn(() => ({
            data: {
                account_security: {
                    totp: {
                        secret_key: 'hello123',
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
            getSecretKey: jest.fn(),
        })),
    };
});

const mockUseGetTwoFa = useGetTwoFa as jest.MockedFunction<typeof useGetTwoFa>;
const mockUseGetSecretKey = useGetSecretKey as jest.MockedFunction<typeof useGetSecretKey>;

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('qrcode.react', () => jest.fn(() => <div>QRCode</div>));

describe('<TwoFactorAuthentication/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const store = mockStore({
        client: {
            has_enabled_two_fa: false,
            email_address: 'test@dev.com',
            is_switching: false,
            setTwoFAChangedStatus: jest.fn(),
        },
    });

    const renderComponent = ({ store_config = store }) => {
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <TwoFactorAuthentication />
                </StoreProvider>
            </APIProvider>
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

    it('should render LoadErrorMessage component if getTwoFA call returns error', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useGetTwoFa
        mockUseGetTwoFa.mockReturnValueOnce({
            error: { message: 'Invalid Request', code: 'InvalidOTP' },
            getTwoFA: jest.fn(),
        });

        renderComponent({ store_config: store });

        await waitFor(() => {
            const error_message = screen.getByText(/Invalid Request/i);
            expect(error_message).toBeInTheDocument();
        });
    });

    it('should render LoadErrorMessage component if getSecretKey call returns error', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useGetSecretKey
        mockUseGetSecretKey.mockReturnValueOnce({
            error: { message: 'Invalid request error', code: 'InvalidOTP' },
            getSecretKey: jest.fn(),
        });

        renderComponent({ store_config: store });

        await waitFor(() => {
            const error_message = screen.getByText(/Invalid request error/i);
            expect(error_message).toBeInTheDocument();
        });
    });

    it('should render TwoFactorDisabled component has_enabled_two_fa is false', async () => {
        renderComponent({ store_config: store });

        const setup_title = screen.getByText(/How to set up 2FA for your Deriv account/i);
        expect(setup_title).toBeInTheDocument();
    });

    it('should render TwoFactorEnabled component has_enabled_two_fa is true', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                has_enabled_two_fa: true,
            },
        };

        renderComponent({ store_config: new_store_config });

        const enabled_title = screen.getByText(/You have enabled 2FA for your Deriv account./i);
        expect(enabled_title).toBeInTheDocument();
    });

    it('should render QR code if getTwoFA call is successful and is_TwoFA_enabled returns false', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useGetTwoFa
        mockUseGetTwoFa.mockReturnValueOnce({
            isSuccess: true,
            is_TwoFA_enabled: true,
            getTwoFA: jest.fn(),
        });

        renderComponent({ store_config: store });

        const qr_code = screen.getByText('QRCode');
        expect(qr_code).toBeInTheDocument();
    });
});
