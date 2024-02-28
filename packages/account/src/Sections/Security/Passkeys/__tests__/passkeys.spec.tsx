import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { useGetPasskeysList, useRegisterPasskey } from '@deriv/hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import Passkeys from '../passkeys';
import PasskeysList from '../components/passkeys-list';

const passkey_name_1 = 'Test Passkey 1';
const passkey_name_2 = 'Test Passkey 2';

const mock_passkeys_list: React.ComponentProps<typeof PasskeysList>['passkeys_list'] = [
    {
        id: 1,
        name: passkey_name_1,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: '',
        icon: 'Test Icon 1',
        passkey_id: 'mock-id-1',
    },
    {
        id: 2,
        name: passkey_name_2,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: '',
        icon: 'Test Icon 2',
        passkey_id: 'mock-id-2',
    },
];

const mockCreatePasskey = jest.fn();
const mockStartPasskeyRegistration = jest.fn();

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPasskeysList: jest.fn(() => ({
        passkeys_list: mock_passkeys_list,
        is_passkeys_list_loading: false,
        passkeys_list_error: '',
    })),
    useIsPasskeySupported: jest.fn(() => ({
        is_passkey_supported: true,
        is_passkey_support_checking: false,
    })),
    useRegisterPasskey: jest.fn(() => ({
        createPasskey: mockCreatePasskey,
        startPasskeyRegistration: mockStartPasskeyRegistration,
        is_passkey_registered: false,
        passkey_registration_error: '',
    })),
}));

describe('Passkeys', () => {
    const mock_store = mockStore({ ui: { is_mobile: true } });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const RenderWrapper = ({ children }: React.PropsWithChildren) => (
        <MemoryRouter>
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        </MemoryRouter>
    );

    it('renders existed passkeys correctly and triggers new passkey creation', () => {
        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );
        expect(screen.getByText(passkey_name_1)).toBeInTheDocument();
        expect(screen.getByText(passkey_name_2)).toBeInTheDocument();

        const create_passkey_button = screen.getByRole('button', { name: 'Create passkey' });
        userEvent.click(create_passkey_button);
        expect(mockStartPasskeyRegistration).toBeCalledTimes(1);
    });
    it("renders 'Experience safer logins' page when no passkey created, trigger 'Learn more' screen, trigger passkey creation", () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });
        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Experience safer logins')).toBeInTheDocument();
        const learn_more_button = screen.getByRole('button', { name: 'Learn more' });
        userEvent.click(learn_more_button);
        expect(screen.getByText('Effortless login with passkeys')).toBeInTheDocument();
        expect(screen.getByText('Tips:')).toBeInTheDocument();
        const create_passkey_button = screen.getByRole('button', { name: 'Create passkey' });
        userEvent.click(create_passkey_button);
        expect(mockStartPasskeyRegistration).toBeCalledTimes(1);
    });
    it('renders success screen when new passkeys created', () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            is_passkey_registered: true,
        });
        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Success!')).toBeInTheDocument();
    });
    it("doesn't render existed passkeys for desktop", () => {
        mock_store.ui.is_mobile = false;
        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.queryByText(passkey_name_1)).not.toBeInTheDocument();
        expect(screen.queryByText(passkey_name_2)).not.toBeInTheDocument();
    });
});
