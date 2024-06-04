import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCreateWallet } from '@deriv/api-v2';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../../hooks/useSyncLocalStorageClientAccounts';
import useWalletAccountSwitcher from '../../../hooks/useWalletAccountSwitcher';
import { ModalProvider } from '../../ModalProvider';
import WalletsAddMoreCardBanner from '../WalletsAddMoreCardBanner';
import '@testing-library/jest-dom/extend-expect';

type TWalletError = {
    buttonText: string;
    errorMessage: string;
    onClick: () => void;
};

type TWalletAddedSuccess = {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

type TWalletButton = {
    children: React.ReactNode;
    disabled: boolean;
    onClick: () => void;
};

jest.mock('@deriv/api-v2', () => ({
    useCreateWallet: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('../../../hooks/useDevice', () => jest.fn());
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

jest.mock('../../Base', () => ({
    WalletButton: ({ children, disabled, onClick }: TWalletButton) => (
        <button data-testid='wallet-button' disabled={disabled} onClick={onClick}>
            {children}
        </button>
    ),
}));

describe('WalletsAddMoreCardBanner', () => {
    const mockMutate = jest.fn();
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
            mutate: mockMutate,
            status: 'idle',
        });

        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
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
        expect(screen.getByTestId('wallet-button')).toHaveTextContent('Add');
    });

    it('should disable the button when is added is true', () => {
        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={true} is_crypto={false} />
            </ModalProvider>
        );

        expect(screen.getByTestId('wallet-button')).toBeDisabled();
        expect(screen.getByTestId('wallet-button')).toHaveTextContent('Added');
    });

    it('should call mutate with correct arguments when add button is clicked', () => {
        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>
        );

        fireEvent.click(screen.getByTestId('wallet-button'));

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
            mutate: mockMutate,
            status: 'success',
        });

        render(
            <ModalProvider>
                <WalletsAddMoreCardBanner currency='USD' is_added={false} is_crypto={false} />
            </ModalProvider>
        );

        await waitFor(() => {
            expect(mockAddWalletAccountToLocalStorage).toHaveBeenCalledWith({ client_id: '123', currency: 'USD' });
            expect(mockSwitchWalletAccount).toHaveBeenCalledWith('123');
        });
    });
});
