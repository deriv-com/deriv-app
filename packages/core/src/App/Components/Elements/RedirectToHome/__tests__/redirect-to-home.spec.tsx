import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RedirectToHome, { REDIRECT_COUNTDOWN_SECONDS } from '../redirect-to-home';

const mockSend = jest.fn();
const mockLogout = jest.fn().mockResolvedValue({ logout: 1 });

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false, isDesktop: true, isTablet: false }),
}));

jest.mock('Services', () => ({
    WS: {
        authorized: {
            send: (...args: unknown[]) => mockSend(...args),
        },
    },
}));

describe('<RedirectToHome />', () => {
    let modal_root_el: HTMLDivElement;
    const original_location = window.location;
    const assign_mock = jest.fn();

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
        Object.defineProperty(window, 'location', { configurable: true, value: original_location });
    });

    beforeEach(() => {
        jest.useRealTimers();
        mockSend.mockReset();
        mockLogout.mockReset();
        mockLogout.mockResolvedValue({ logout: 1 });
        assign_mock.mockClear();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...original_location, hostname: 'localhost', assign: assign_mock },
        });
    });

    const renderComponent = (
        after_create?: (store: ReturnType<typeof mockStore>) => void,
        client: Record<string, unknown> = {}
    ) => {
        const mock = mockStore({
            client: {
                is_logged_in: true,
                is_authorize: true,
                is_client_store_initialized: true,
                account_status: { cashier_validation: [] },
                logout: mockLogout,
                ...client,
            },
        });
        after_create?.(mock);
        return render(<RedirectToHome />, {
            wrapper: ({ children }: { children: JSX.Element }) => (
                <StoreProvider store={mock}>{children}</StoreProvider>
            ),
        });
    };

    it('should not render anything when the user is not fully logged in', () => {
        renderComponent(undefined, { is_authorize: false });
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
    });

    it('should not render anything when account status is not loaded', () => {
        renderComponent(store => {
            store.client.account_status = {};
        });
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
    });

    it('should not render anything when the user has unwelcome_status', () => {
        renderComponent(undefined, {
            account_status: { cashier_validation: ['unwelcome_status'] },
        });
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
    });

    it('should render the popup when unwelcome_status is false and keep it open on overlay click', async () => {
        renderComponent();
        expect(screen.getByText('Continue to home.deriv.com')).toBeInTheDocument();
        expect(screen.getByText('Contact support')).toBeInTheDocument();
        expect(screen.getByTestId('dt_redirect_to_home_popup_close')).toBeInTheDocument();

        await userEvent.click(screen.getByTestId('dt_overlay'));
        expect(screen.getByText('Continue to home.deriv.com')).toBeInTheDocument();
    });

    it('should show a non-dismissable banner after the popup is closed', async () => {
        renderComponent();

        await userEvent.click(screen.getByTestId('dt_redirect_to_home_popup_close'));

        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_redirect_to_home_banner')).toBeInTheDocument();
        expect(screen.getByText('Deriv has a new home')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Faster, simpler and packed with new features for trading, deposits and account management. Sign in with your usual Deriv credentials, nothing to set up.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact support' })).toBeInTheDocument();
        expect(screen.queryByTestId('dt_redirect_to_home_banner_close')).not.toBeInTheDocument();
    });

    it('should logout and redirect to live chat when banner contact support is clicked', async () => {
        mockLogout.mockImplementation(() => new Promise(() => {}));
        renderComponent();

        await userEvent.click(screen.getByTestId('dt_redirect_to_home_popup_close'));
        await userEvent.click(screen.getByRole('button', { name: 'Contact support' }));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(assign_mock).toHaveBeenCalledWith(expect.stringMatching(/\/dashboard\/login\?live_chat=true$/));
        });
    });

    it('should show a loader on the continue button while the migration API is in progress', async () => {
        let resolve_migration: (value: { client_migration: string }) => void = () => undefined;
        mockSend.mockImplementation(
            () =>
                new Promise(resolve => {
                    resolve_migration = resolve;
                })
        );
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByTestId('button-loader')).toBeInTheDocument();
        });

        await act(async () => {
            resolve_migration({ client_migration: 'parked' });
        });

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: 'Go now' })).toBeDisabled();
    });

    it('should keep go now disabled for parked status and not redirect before the timer ends', async () => {
        mockSend.mockResolvedValue({ client_migration: 'parked' });
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: 'Go now' })).toBeDisabled();
        await userEvent.click(screen.getByRole('button', { name: 'Go now' }));
        expect(mockLogout).not.toHaveBeenCalled();
        expect(assign_mock).not.toHaveBeenCalled();
    });

    it('should poll again after the timer and reset when status is still parked', async () => {
        jest.useFakeTimers();
        mockSend.mockResolvedValue({ client_migration: 'parked' });
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });
        expect(mockSend).toHaveBeenCalledTimes(1);

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(2);
        });
        expect(screen.getByRole('button', { name: 'Go now' })).toBeDisabled();
        expect(assign_mock).not.toHaveBeenCalled();
    });

    it('should show contact support after two pending rechecks', async () => {
        jest.useFakeTimers();
        mockSend.mockResolvedValue({ client_migration: 'parked' });
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });
        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(2);
        });

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });
        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(3);
        });

        expect(
            screen.getByText('This seems to be taking a while. Contact support for assistance.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact support' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Go now' })).not.toBeInTheDocument();
        expect(assign_mock).not.toHaveBeenCalled();

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });
        expect(mockSend).toHaveBeenCalledTimes(3);
    });

    it('should enable go now and redirect when poll returns already_migrated', async () => {
        jest.useFakeTimers();
        mockSend
            .mockResolvedValueOnce({ client_migration: 'parked' })
            .mockResolvedValueOnce({ client_migration: 'already_migrated' });
        mockLogout.mockImplementation(() => new Promise(() => {}));
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(2);
        });
        expect(mockLogout).toHaveBeenCalled();
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/');
    });

    it('should redirect when poll returns any non-MigrationParkError error', async () => {
        jest.useFakeTimers();
        mockSend.mockResolvedValueOnce({ client_migration: 'parked' }).mockResolvedValueOnce({
            error: { code: 'AuthorizationRequired', message: 'Please log in.' },
        });
        mockLogout.mockImplementation(() => new Promise(() => {}));
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(2);
        });
        expect(mockLogout).toHaveBeenCalled();
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/');
    });

    it('should show the error content when poll returns MigrationParkError', async () => {
        jest.useFakeTimers();
        mockSend.mockResolvedValueOnce({ client_migration: 'parked' }).mockResolvedValueOnce({
            error: {
                code: 'MigrationParkError',
                message: 'Sorry, we could not schedule your account migration.',
            },
        });
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });

        await waitFor(() => {
            expect(screen.getByText('Sorry, we could not schedule your account migration.')).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: 'Contact support' })).toBeInTheDocument();
        expect(assign_mock).not.toHaveBeenCalled();
    });

    it('should enable go now immediately when initial status is already_migrated', async () => {
        mockSend.mockResolvedValue({ client_migration: 'already_migrated' });
        mockLogout.mockImplementation(() => new Promise(() => {}));
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: 'Go now' })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: 'Go now' }));

        expect(mockLogout).toHaveBeenCalled();
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/');
    });

    it('should logout and redirect when already_migrated countdown reaches zero', async () => {
        jest.useFakeTimers();
        mockSend.mockResolvedValue({ client_migration: 'already_migrated' });
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        });

        await act(async () => {
            jest.advanceTimersByTime(REDIRECT_COUNTDOWN_SECONDS * 1000);
        });

        expect(mockLogout).toHaveBeenCalled();
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/');
    });

    it('should retry migration once and show the API error with contact support only', async () => {
        mockSend
            .mockResolvedValueOnce({
                error: { code: 'MigrationParkError', message: 'Sorry, we could not schedule your account migration.' },
            })
            .mockResolvedValueOnce({
                error: { code: 'MigrationParkError', message: 'Sorry, we could not schedule your account migration.' },
            });

        renderComponent();
        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(2);
        });
        expect(screen.getByText('Sorry, we could not schedule your account migration.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact support' })).toBeInTheDocument();
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
    });

    it('should treat a successful retry as migration success with go now disabled for in-progress', async () => {
        mockSend
            .mockResolvedValueOnce({
                error: { code: 'MigrationParkError', message: 'Temporary failure' },
            })
            .mockResolvedValueOnce({ client_migration: 'migration_in_progress' });

        renderComponent();
        await userEvent.click(screen.getByRole('button', { name: 'Continue to home.deriv.com' }));

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(2);
        });
        expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go now' })).toBeDisabled();
    });

    it('should show a loader on contact support and disable continue when contact support is clicked', async () => {
        mockLogout.mockImplementation(() => new Promise(() => {}));
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Contact support' }));

        expect(screen.getByTestId('button-loader')).toBeInTheDocument();
        expect(screen.queryByText('Contact support')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue to home.deriv.com' })).toBeDisabled();
        expect(mockLogout).toHaveBeenCalled();
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/login?live_chat=true');
    });

    it('should logout and redirect to live chat when contact support is clicked', async () => {
        renderComponent();
        await userEvent.click(screen.getByRole('button', { name: 'Contact support' }));

        expect(mockLogout).toHaveBeenCalled();
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/login?live_chat=true');
    });
});
