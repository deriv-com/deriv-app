import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { APIProvider } from '@deriv/api';
import { useGetPasskeysList, useRegisterPasskey, useRemovePasskey, useRenamePasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasskeysList } from '../components/passkeys-list';
import Passkeys from '../passkeys';

const passkey_name_1 = 'Test Passkey 1';
const passkey_name_2 = 'Test Passkey 2';

const mock_passkeys_list: React.ComponentProps<typeof PasskeysList>['passkeys_list'] = [
    {
        id: 1,
        name: passkey_name_1,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: 'Test device 1',
        icon: 'Test Icon 1',
        passkey_id: 'mock-id-1',
    },
    {
        id: 2,
        name: passkey_name_2,
        last_used: 1633124800000,
        created_at: 1634024800000,
        stored_on: 'Test device 2',
        icon: 'Test Icon 2',
        passkey_id: 'mock-id-2',
    },
];

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPasskeysList: jest.fn(() => ({})),
    useRegisterPasskey: jest.fn(() => ({})),
    useRenamePasskey: jest.fn(() => ({})),
    useRemovePasskey: jest.fn(() => ({})),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>MockLoading</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: () => 'test OS',
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

describe('Passkeys', () => {
    let mock_store: ReturnType<typeof mockStore>, modal_root_el: HTMLElement;
    const create_passkey = 'Enable biometrics';
    const error_message = "We're facing a temporary issue. Try again later.";
    const error_title = 'Unable to process your request';
    const ok_button = /ok/i;
    const continue_button = /continue/i;

    const tracking_event = 'ce_passkey_account_settings_form';
    const getAnalyticsParams = (
        action: string,
        additional_data: { error_message?: string; subform_name?: string } = {}
    ) => ({
        action,
        form_name: tracking_event,
        operating_system: 'test OS',
        ...additional_data,
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mock_store = mockStore({
            client: { is_passkey_supported: true },
            common: { network_status: { class: 'online' } },
        });
        jest.clearAllMocks();
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        render(
            <MemoryRouter>
                <APIProvider>
                    <StoreProvider store={mock_store}>
                        <Passkeys />
                    </StoreProvider>
                </APIProvider>
            </MemoryRouter>
        );
    };

    const mockCreatePasskey = jest.fn();
    const mockStartPasskeyRegistration = jest.fn();
    const mockRenamePasskey = jest.fn();
    const mockRemovePasskey = jest.fn();
    const mockReloadPasskeysList = jest.fn();

    it("doesn't render existed passkeys for desktop and tablet", () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: false });

        renderComponent();

        expect(screen.queryByText(passkey_name_1)).not.toBeInTheDocument();
        expect(screen.queryByText(passkey_name_2)).not.toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders loader if passkeys list is loading', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: true,
        });

        renderComponent();

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders loader if network_status is offline', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
        });

        mock_store.common.network_status.class = 'offline';

        renderComponent();

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders existed passkeys correctly and triggers new passkey creation', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            startPasskeyRegistration: mockStartPasskeyRegistration,
        });

        renderComponent();

        expect(screen.getByText(passkey_name_1)).toBeInTheDocument();
        expect(screen.getByText(passkey_name_2)).toBeInTheDocument();

        const create_passkey_button = screen.getByRole('button', { name: create_passkey });
        await userEvent.click(create_passkey_button);
        expect(mockStartPasskeyRegistration).toBeCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_started', { subform_name: 'passkey_main' })
        );
    });

    it("renders 'Your key to safer logins' page when no passkey created, trigger 'Learn more' screen, trigger passkey creation", async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: [],
        });
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            startPasskeyRegistration: mockStartPasskeyRegistration,
        });

        renderComponent();

        expect(screen.getByText('Your key to safer logins')).toBeInTheDocument();
        const learn_more_button = screen.getByRole('button', { name: 'Learn more' });
        await userEvent.click(learn_more_button);
        expect(screen.getByTestId('dt_learn_more_back_button')).toBeInTheDocument();
    });

    it('renders passkeys creation modal and triggers new passkey creation', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
        });
        mock_store.client.is_passkey_supported = true;

        (useRegisterPasskey as jest.Mock).mockReturnValue({
            createPasskey: mockCreatePasskey,
            startPasskeyRegistration: mockStartPasskeyRegistration,
        });

        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: create_passkey }));
        expect(screen.getByText('Set up biometrics')).toBeInTheDocument();
        expect(screen.getByText('Enable screen lock on your device.')).toBeInTheDocument();
        expect(screen.getByText('Sign in to your Google or iCloud account.')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: continue_button }));
        expect(mockCreatePasskey).toBeCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_reminder_passed')
        );
    });

    it('renders passkeys and triggers rename passkey', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
            passkeys_list: mock_passkeys_list,
        });
        mock_store.client.is_passkey_supported = true;

        (useRenamePasskey as jest.Mock).mockReturnValue({
            renamePasskey: mockRenamePasskey,
        });

        renderComponent();

        expect(screen.queryByText('Edit biometrics')).not.toBeInTheDocument();

        await userEvent.click(screen.getAllByTestId('dt_dropdown_display')[0]);
        await userEvent.click(screen.getByText('Rename'));

        expect(Analytics.trackEvent).toHaveBeenCalledWith(tracking_event, getAnalyticsParams('passkey_rename_started'));
        expect(screen.getByText('Edit biometrics')).toBeInTheDocument();

        const input: HTMLInputElement = screen.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'new passkey name');
        await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(mockRenamePasskey).toHaveBeenCalledTimes(1);
        });
    });

    it('renders passkeys and triggers remove passkey', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
            passkeys_list: mock_passkeys_list,
        });
        mock_store.client.is_passkey_supported = true;

        (useRemovePasskey as jest.Mock).mockReturnValue({
            removePasskey: mockRemovePasskey,
        });

        renderComponent();

        expect(screen.queryByText('Edit biometrics')).not.toBeInTheDocument();

        await userEvent.click(screen.getAllByTestId('dt_dropdown_display')[0]);
        await userEvent.click(screen.getByText('Remove'));

        expect(Analytics.trackEvent).toHaveBeenCalledWith(tracking_event, getAnalyticsParams('passkey_remove_started'));
        expect(screen.getByText('Are you sure you want to remove this passkey?')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /remove/i }));
        expect(mockRemovePasskey).toHaveBeenCalledTimes(1);
    });

    it('renders passkeys registration error modal and triggers closing', async () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            passkey_registration_error: { message: 'error' },
            startPasskeyRegistration: mockStartPasskeyRegistration,
            createPasskey: mockCreatePasskey,
        });

        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: create_passkey }));
        await userEvent.click(screen.getByRole('button', { name: continue_button }));

        await waitFor(() => {
            expect(screen.getByText(error_message)).toBeInTheDocument();
            expect(screen.getByText(error_title)).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: ok_button }));

        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
        });
    });

    it('renders passkeys list error modal and triggers closing', async () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            passkey_registration_error: null,
            startPasskeyRegistration: mockStartPasskeyRegistration,
            createPasskey: mockCreatePasskey,
        });

        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list_error: { message: 'error' },
            reloadPasskeysList: mockReloadPasskeysList,
        });

        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: create_passkey }));
        await userEvent.click(screen.getByRole('button', { name: continue_button }));

        await waitFor(() => {
            expect(screen.getByText(error_message)).toBeInTheDocument();
            expect(screen.getByText(error_title)).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: ok_button }));
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
    });
});
