import React, { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCreateWallet, useIsEuRegion, useWalletAccountsList } from '@deriv/api-v2';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import useSyncLocalStorageClientAccounts from '../../../hooks/useSyncLocalStorageClientAccounts';
import useWalletAccountSwitcher from '../../../hooks/useWalletAccountSwitcher';
import { ModalProvider } from '../../ModalProvider';
import WalletsAddMoreCardBanner from '../WalletsAddMoreCardBanner';

type TWalletError = {
    buttonText: string;
    errorMessage: string;
    onClick: () => void;
};

type TWalletAddedSuccess = {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: { loginid: 'CRW1' },
    })),
    useCreateWallet: jest.fn(),
    useIsEuRegion: jest.fn(() => ({
        data: false,
    })),
    useWalletAccountsList: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('@deriv/utils', () => ({
    ...jest.requireActual('@deriv/utils'),
    getAccountsFromLocalStorage: jest.fn(() => ({
        VRW1: {
            token: '12345',
        },
    })),
}));

jest.mock('../../../helpers/urls', () => ({
    ...jest.requireActual('../../../helpers/urls'),
    OUT_SYSTEMS_TRADERSHUB: {
        PRODUCTION: 'https://hub.deriv.com/tradershub',
        STAGING: 'https://staging-hub.deriv.com/tradershub',
    },
}));

jest.mock('../../../hooks/useSyncLocalStorageClientAccounts', () => jest.fn());
jest.mock('../../../hooks/useWalletAccountSwitcher', () => jest.fn());

jest.mock('../../WalletCurrencyIcon', () => ({
    WalletCurrencyIcon: () => <div data-testid='wallet-currency-icon' />,
}));

jest.mock('../../WalletError', () => ({
    WalletError: ({ buttonText, errorMessage, onClick }: TWalletError) => (
        <div data-testid='wallet-error'>
            <button onClick={onClick}>{buttonText}</button>
            <span>{errorMessage}</span>
        </div>
    ),
}));

jest.mock('../../WalletAddedSuccess', () => ({
    WalletAddedSuccess: ({ onPrimaryButtonClick, onSecondaryButtonClick }: TWalletAddedSuccess) => (
        <div data-testid='wallet-added-success'>
            <button onClick={onPrimaryButtonClick}>Primary</button>
            <button onClick={onSecondaryButtonClick}>Secondary</button>
        </div>
    ),
}));

const wrapper = ({ children }: PropsWithChildren) => <ModalProvider>{children}</ModalProvider>;

describe('WalletsAddMoreCardBanner', () => {
    const mockMutate = jest.fn().mockResolvedValue({ new_account_wallet: { client_id: '123', currency: 'USD' } });
    const mockHistoryPush = jest.fn();
    const mockSwitchWalletAccount = jest.fn();
    const mockAddWalletAccountToLocalStorage = jest.fn();

    let $root: HTMLDivElement, $modalContainer: HTMLDivElement;

    beforeEach(() => {
        jest.clearAllMocks();

        (useCreateWallet as jest.Mock).mockReturnValue({
            data: undefined,
            error: null,
            isSuccess: false,
            mutateAsync: mockMutate,
            status: 'idle',
        });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                { is_disabled: false, is_virtual: false, loginid: 'real1' },
                { is_virtual: true, loginid: 'demo123' },
            ],
        });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useSyncLocalStorageClientAccounts as jest.Mock).mockReturnValue({
            addWalletAccountToLocalStorage: mockAddWalletAccountToLocalStorage,
        });
        (useWalletAccountSwitcher as jest.Mock).mockReturnValue(mockSwitchWalletAccount);
        (useHistory as jest.Mock).mockReturnValue({ push: mockHistoryPush });
        $root = document.createElement('div');
        $root.id = 'root';
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($root);
        document.body.appendChild($modalContainer);
    });

    afterEach(() => {
        document.body.removeChild($root);
        document.body.removeChild($modalContainer);
    });

    it('should render the default component correctly', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency={undefined} is_added={false} is_crypto={false} />
            </ModalProvider>
        );

        expect(screen.getByTestId('wallet-currency-icon')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Add');
    });

    it('should disable the button when is added is true', () => {
        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={true} is_crypto={false} />
            </ModalProvider>
        );

        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveTextContent('Added');
    });

    it('should call mutate with correct arguments when add button is clicked', () => {
        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>
        );

        fireEvent.click(screen.getByText('Add'));

        expect(mockMutate).toHaveBeenCalledWith({ account_type: 'doughflow', currency: 'USD' });
    });

    it('should display WalletAddedSuccess modal on successful wallet creation and close modal on secondary button click', () => {
        (useCreateWallet as jest.Mock).mockReturnValue({
            data: {
                client_id: '123',
                currency: 'USD',
                display_balance: '100.00',
                landing_company_shortcode: 'shortcode',
            },
            error: null,
            isSuccess: true,
            mutate: mockMutate,
            status: 'success',
        });

        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>,
            { container: $root }
        );
        expect(screen.getByTestId('wallet-added-success')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Secondary'));
        expect(screen.queryByTestId('wallet-added-success')).not.toBeInTheDocument();
    });

    it('should redirect to deposit page on click of primary button in WalletAddedSuccess modal', () => {
        (useCreateWallet as jest.Mock).mockReturnValue({
            data: {
                client_id: '123',
                currency: 'USD',
                display_balance: '100.00',
                landing_company_shortcode: 'shortcode',
            },
            error: null,
            isSuccess: true,
            mutate: mockMutate,
            status: 'success',
        });

        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>,
            { container: $root }
        );
        expect(screen.getByTestId('wallet-added-success')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Primary'));
        expect(mockHistoryPush).toHaveBeenCalledWith('/wallet/deposit');
        expect(screen.queryByTestId('wallet-added-success')).not.toBeInTheDocument();
    });

    it('should display WalletError modal on error status', async () => {
        (useCreateWallet as jest.Mock).mockReturnValue({
            data: null,
            error: { error: { message: 'Error message' } },
            isSuccess: false,
            mutate: mockMutate,
            status: 'error',
        });

        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>,
            { container: $root }
        );

        expect(screen.getByTestId('wallet-error')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByTestId('wallet-error')).not.toBeInTheDocument();
    });

    it('should add wallet account to local storage and switch wallet account on successful creation', async () => {
        (useCreateWallet as jest.Mock).mockReturnValue({
            data: { client_id: '123', currency: 'USD' },
            error: null,
            isSuccess: true,
            mutateAsync: mockMutate,
            status: 'success',
        });

        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>
        );

        fireEvent.click(screen.getByText('Add'));

        await waitFor(() => {
            expect(mockAddWalletAccountToLocalStorage).toHaveBeenCalledWith({
                client_id: '123',
                currency: 'USD',
                display_balance: '0.00 USD',
            });
        });
        await waitFor(() => {
            expect(mockSwitchWalletAccount).toHaveBeenCalledWith('123');
        });
    });

    it('redirects to OutSystems staging for EU users on staging', async () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'VRW1' },
        });

        Analytics.getFeatureValue = jest.fn().mockReturnValue(true);

        const originalWindowLocation = window;
        Object.defineProperty(window, 'location', {
            value: { href: '' },
        });

        render(<WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />, { wrapper });

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
        expect(window.location.href).toBe(
            'https://staging-hub.deriv.com/tradershub/redirect?action=real-account-signup&currency=USD&target=maltainvest'
        );

        Object.defineProperty(window, 'location', {
            value: originalWindowLocation,
        });
    });

    it('redirects to OutSystems production for EU users on production', async () => {
        const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'VRW1' },
        });

        Analytics.getFeatureValue = jest.fn().mockReturnValue(true);

        const originalWindowLocation = window;
        Object.defineProperty(window, 'location', {
            value: { href: '' },
        });

        render(<WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />, { wrapper });

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
        expect(window.location.href).toBe(
            'https://hub.deriv.com/tradershub/redirect?action=real-account-signup&currency=USD&target=maltainvest'
        );

        Object.defineProperty(window, 'location', {
            value: originalWindowLocation,
        });
        process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    });

    it('redirects to OutSystems staging for demo only ROW account on staging', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'VRW1' },
        });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [{ is_virtual: true, loginid: 'demo123' }],
        });

        Analytics.getFeatureValue = jest.fn().mockReturnValue(true);

        const originalWindowLocation = window;
        Object.defineProperty(window, 'location', {
            value: { href: '' },
        });

        render(<WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />, { wrapper });

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
        expect(window.location.href).toBe(
            'https://staging-hub.deriv.com/tradershub/redirect?action=real-account-signup&currency=USD&target=maltainvest'
        );

        Object.defineProperty(window, 'location', {
            value: originalWindowLocation,
        });
    });

    it('redirects to OutSystems production for demo only ROW account on production', async () => {
        const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'VRW1' },
        });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [{ is_virtual: true, loginid: 'demo123' }],
        });

        Analytics.getFeatureValue = jest.fn().mockReturnValue(true);

        const originalWindowLocation = window;
        Object.defineProperty(window, 'location', {
            value: { href: '' },
        });

        render(<WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />, { wrapper });

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
        expect(window.location.href).toBe(
            'https://hub.deriv.com/tradershub/redirect?action=real-account-signup&currency=USD&target=maltainvest'
        );

        Object.defineProperty(window, 'location', {
            value: originalWindowLocation,
        });
        process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    });
});
