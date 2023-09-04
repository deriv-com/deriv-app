import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { WS, isDesktop, isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import TwoFactorAuthentication from '../two-factor-authentication';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    WS: {
        authorized: {
            accountSecurity: jest.fn().mockResolvedValue({}),
        },
    },
}));

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
            email_address: 'test@dev.com',
            getTwoFAStatus: jest.fn().mockResolvedValue(false),
            has_enabled_two_fa: false,
            is_switching: false,
            setTwoFAStatus: jest.fn(),
            setTwoFAChangedStatus: jest.fn(),
        },
        common: {
            is_language_changing: false,
        },
        ui: {
            // @ts-expect-error component is passed from Store. Will be refactored later
            notification_messages_ui: jest.fn(() => <div>Notification</div>),
        },
    });

    const renderComponent = ({ store_config = store }) => {
        return render(
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

    it('should render LoadErrorMessage component if getTwoFAStatus call returns error', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                getTwoFAStatus: jest.fn().mockResolvedValue({ error: { message: 'error while getting 2FA status' } }),
            },
        };

        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            const error_message = screen.getByText('error while getting 2FA status');
            expect(error_message).toBeInTheDocument();
        });
    });

    it('should render LoadErrorMessage component if websocket call returns error when 2FA is disabled', async () => {
        WS.authorized.accountSecurity.mockResolvedValueOnce({
            error: { message: 'AccountSecurity error' },
        });

        renderComponent({ store_config: store });

        await waitFor(() => {
            const error_message = screen.getByText('AccountSecurity error');
            expect(error_message).toBeInTheDocument();
        });
    });

    it('should render How to set up 2FA title when has_enabled_two_fa is false', async () => {
        renderComponent({ store_config: store });

        await waitFor(() => {
            const setup_title = screen.getByText('How to set up 2FA for your Deriv account');
            expect(setup_title).toBeInTheDocument();
        });
    });

    it('should render timeline_1 component title when has_enabled_two_fa is false', async () => {
        renderComponent({ store_config: store });

        await waitFor(() => {
            const timeline_title_1 = screen.getByText(/Scan the QR code below with your 2FA app. We recommend./i);
            const authy_link = screen.getByRole('link', { name: 'Authy' });
            const google_authenticator_link = screen.getByRole('link', { name: 'Google Authenticator' });

            expect(timeline_title_1).toBeInTheDocument();
            expect(authy_link).toHaveAttribute('href', 'https://authy.com/');
            expect(google_authenticator_link).toHaveAttribute(
                'href',
                'https://github.com/google/google-authenticator/wiki#implementations'
            );
        });
    });

    it('should render QR code when has_enabled_two_fa is false', async () => {
        renderComponent({ store_config: store });

        await waitFor(() => {
            const qr_code = screen.getByText('QRCode');
            expect(qr_code).toBeInTheDocument();
        });
    });

    it('should render clipboard component to setup 2FA', async () => {
        WS.authorized.accountSecurity.mockResolvedValueOnce({
            account_security: {
                totp: {
                    secret_key: 'hello123',
                },
            },
        });
        renderComponent({ store_config: store });

        await waitFor(() => {
            const helper_text = screen.getByText(
                /If you are unable to scan the QR code, you can manually enter this code instead:/i
            );
            const secret_text = screen.getByText('hello123');
            const clipboard_component = screen.getByTestId('2fa_clipboard');

            expect(helper_text).toBeInTheDocument();
            expect(secret_text).toBeInTheDocument();
            expect(clipboard_component).toBeInTheDocument();
        });
    });

    it('should render step-2 title for setting up 2FA', async () => {
        renderComponent({ store_config: store });

        await waitFor(() => {
            const step_2_title = screen.getByText(/Enter the authentication code generated by your 2FA app:/i);
            expect(step_2_title).toBeInTheDocument();
        });
    });

    it('should render digitform component when 2FA is disabled', async () => {
        renderComponent({ store_config: store });

        await waitFor(() => {
            const digitform = screen.getByTestId('digitform_2fa_disabled');
            expect(digitform).toBeInTheDocument();
        });
    });

    it('should render 2FA article component for mobile when 2FA is disabled', async () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        renderComponent({ store_config: store });

        await waitFor(() => {
            // const article_component = screen.getByTestId('two_fa_article_mobile');
            const article_component = screen.getByText('Two-factor authentication (2FA)');
            expect(article_component).toBeInTheDocument();
        });
    });

    it('should render 2FA article component for dekstop when 2FA is disabled', async () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);

        renderComponent({ store_config: store });

        await waitFor(() => {
            // const article_component = screen.getByTestId('two_fa_article_mobile');
            const article_component = screen.getByText('Two-factor authentication (2FA)');
            expect(article_component).toBeInTheDocument();
        });
    });

    it('should render TwoFactorEnabled component when 2FA is enabled', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                getTwoFAStatus: jest.fn().mockResolvedValue(true),
                has_enabled_two_fa: true,
            },
        };
        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            const title_1 = screen.getByText('2FA enabled');
            const title_2 = screen.getByText('You have enabled 2FA for your Deriv account.');
            const title_3 = screen.getByText(
                'To disable 2FA, please enter the six-digit authentication code generated by your 2FA app below:'
            );
            expect(title_1).toBeInTheDocument();
            expect(title_2).toBeInTheDocument();
            expect(title_3).toBeInTheDocument();
        });
    });
    it('should render DigitForm component when 2FA is enabled', async () => {
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                getTwoFAStatus: jest.fn().mockResolvedValue(true),
                has_enabled_two_fa: true,
            },
        };
        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            const digitform = screen.getByTestId('digitform_2fa_enabled');
            expect(digitform).toBeInTheDocument();
        });
    });
});
