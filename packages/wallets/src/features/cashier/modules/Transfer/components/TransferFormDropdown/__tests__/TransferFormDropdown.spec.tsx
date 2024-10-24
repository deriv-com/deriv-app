import React, { createRef } from 'react';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { APIProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { useModal } from '../../../../../../../components/ModalProvider';
import { useTransfer } from '../../../provider';
import TransferFormDropdown from '../TransferFormDropdown';

jest.mock('formik', () => ({
    useFormikContext: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('../../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('../../../provider', () => ({
    useTransfer: jest.fn(),
}));

describe('TransferFormDropdown', () => {
    const setValuesMock = jest.fn();
    const showModalMock = jest.fn();
    const hideModalMock = jest.fn();
    const account = {
        currency: 'USD',
        loginid: 'CR1234',
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useFormikContext as jest.Mock).mockReturnValue({
            setValues: setValuesMock,
            values: {
                fromAccount: null,
                toAccount: null,
            },
        });

        (useHistory as jest.Mock).mockReturnValue({
            location: {
                pathname: '/wallets/cashier/transfer',
                state: {
                    shouldSelectDefaultWallet: false,
                    toAccountLoginId: undefined,
                },
            },
        });

        (useModal as jest.Mock).mockReturnValue({
            hide: hideModalMock,
            show: showModalMock,
        });

        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });

        (useTransfer as jest.Mock).mockReturnValue({
            accounts: {
                tradingAccounts: [],
                walletAccounts: [
                    {
                        currency: 'USD',
                        loginid: 'CR1234',
                    },
                    {
                        currency: 'BTC',
                        loginid: 'CR4321',
                    },
                ],
            },
            activeWallet: {
                currency: 'USD',
                demo_account: 0,
                loginid: 'CR1234',
            },
            hasPlatformStatus: jest.fn(),
        });
    });

    const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
        <APIProvider>
            <WalletsAuthProvider>{children}</WalletsAuthProvider>
        </APIProvider>
    );

    it('renders default content correctly', () => {
        render(<TransferFormDropdown fieldName='toAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        expect(screen.getByText('Transfer to')).toBeInTheDocument();
        expect(screen.getByText('Select a trading account or a Wallet')).toBeInTheDocument();
    });

    it('renders content correctly when no active wallet data', () => {
        (useHistory as jest.Mock).mockReturnValue({
            location: {
                pathname: '/wallets/cashier/transfer',
            },
        });
        (useTransfer as jest.Mock).mockReturnValue({
            accounts: {},
            hasPlatformStatus: jest.fn(),
        });
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: true,
        });

        render(<TransferFormDropdown fieldName='fromAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Select a trading account')).toBeInTheDocument();
        expect(screen.queryByText('Select a trading account or a Wallet')).not.toBeInTheDocument();
    });

    it('renders content correctly when account available in formik', () => {
        (useFormikContext as jest.Mock).mockReturnValue({
            setValues: setValuesMock,
            values: {
                fromAccount: {
                    currency: 'USD',
                    displayBalance: '1000 USD',
                    loginid: 'CR1234',
                },
                toAccount: null,
            },
        });
        (useTransfer as jest.Mock).mockReturnValue({
            accounts: {
                tradingAccounts: [],
                walletAccounts: [],
            },
            activeWallet: {
                currency: 'USD',
                displayBalance: '1000 USD',
                loginid: 'CR1234',
            },
            hasPlatformStatus: jest.fn(),
        });
        render(<TransferFormDropdown fieldName='fromAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
    });

    it('shows modal on button click', () => {
        render(<TransferFormDropdown fieldName='fromAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        fireEvent.click(screen.getByRole('button'));

        expect(showModalMock).toHaveBeenCalledTimes(1);
    });

    it('handles account selection correctly for fromAccount', () => {
        render(<TransferFormDropdown fieldName='fromAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        fireEvent.click(screen.getByRole('button'));

        const handleSelect = showModalMock.mock.calls[0][0].props.onSelect;

        handleSelect(account);

        expect(setValuesMock).toHaveBeenCalledWith(expect.any(Function));
        const setValuesCallback = setValuesMock.mock.calls[0][0];
        const newValues = setValuesCallback({ fromAccount: null, toAccount: null });
        expect(newValues.fromAccount.loginid).toBe('CR1234');
    });

    it('handles account selection correctly for toAccount', () => {
        render(<TransferFormDropdown fieldName='toAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        fireEvent.click(screen.getByRole('button'));

        const handleSelect = showModalMock.mock.calls[0][0].props.onSelect;

        handleSelect(account);

        expect(setValuesMock).toHaveBeenCalledWith(expect.any(Function));
        const setValuesCallback = setValuesMock.mock.calls[0][0];
        const newValues = setValuesCallback({ toAccount: null });
        expect(newValues.toAccount.loginid).toBe('CR1234');
    });

    it('calls setValues when shouldSelectDefaultWallet is true', () => {
        (useHistory as jest.Mock).mockReturnValue({
            location: {
                pathname: '/wallet/account-transfer',
                state: {
                    shouldSelectDefaultWallet: true,
                    toAccountLoginId: undefined,
                },
            },
        });
        (useTransfer as jest.Mock).mockReturnValue({
            accounts: {
                tradingAccounts: [],
                walletAccounts: [
                    {
                        currency: 'USD',
                        loginid: 'CR1234',
                    },
                ],
            },
            activeWallet: {
                currency: 'USD',
                loginid: 'CR1234',
            },
            hasPlatformStatus: jest.fn(),
        });

        render(<TransferFormDropdown fieldName='toAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        expect(setValuesMock).toHaveBeenCalledWith(expect.any(Function));
        const setValuesCallback = setValuesMock.mock.calls[0][0];
        const newValues = setValuesCallback({ toAccount: null });
        expect(newValues.toAccount.loginid).toBe('CR1234');
    });

    it('calls setValues when loginid for toAccount is set', () => {
        (useHistory as jest.Mock).mockReturnValue({
            location: {
                pathname: '/wallet/account-transfer',
                state: {
                    toAccountLoginId: 'CR1234',
                },
            },
        });
        (useTransfer as jest.Mock).mockReturnValue({
            accounts: {
                tradingAccounts: [],
                walletAccounts: [
                    {
                        currency: 'USD',
                        loginid: 'CR1234',
                    },
                ],
            },
            activeWallet: {
                currency: 'USD',
                loginid: 'CR1234',
            },
            hasPlatformStatus: jest.fn(),
        });

        render(<TransferFormDropdown fieldName='toAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        expect(setValuesMock).toHaveBeenCalledWith(expect.any(Function));
        const setValuesCallback = setValuesMock.mock.calls[0][0];
        const newValues = setValuesCallback({ toAccount: null });
        expect(newValues.toAccount.loginid).toBe('CR1234');
    });

    it('does not call setValues if account loginid is same as selected account loginid', () => {
        (useFormikContext as jest.Mock).mockReturnValue({
            setValues: setValuesMock,
            values: {
                fromAccount: {
                    currency: 'USD',
                    loginid: 'CR1234',
                },
                toAccount: null,
            },
        });

        render(<TransferFormDropdown fieldName='fromAccount' mobileAccountsListRef={createRef()} />, { wrapper });

        fireEvent.click(screen.getByRole('button'));
        const handleSelect = showModalMock.mock.calls[0][0].props.onSelect;
        handleSelect(account);
        expect(setValuesMock).not.toHaveBeenCalled();
    });
});
