import React, { PropsWithChildren } from 'react';
import { useActiveWalletAccount, useAuthorize, useCashierFiatAddress, useDepositCryptoAddress } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { CashierLocked, DepositLocked } from '../../../modules';
import WalletDeposit from '../WalletDeposit';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(),
    useCashierFiatAddress: jest.fn(),
    useDepositCryptoAddress: jest.fn(),
}));

jest.mock('../../../modules', () => ({
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    DepositCryptoModule: jest.fn(() => <div>MockedDepositCryptoModule</div>),
    DepositFiatModule: jest.fn(() => <div>MockedDepositFiatModule</div>),
    DepositLocked: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('../../../../../components', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../../../screens', () => ({
    DepositErrorScreen: jest.fn(({ error }) => <div>MockedDepositErrorScreen - {error.message}</div>),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <CashierLocked>
        <DepositLocked>{children}</DepositLocked>
    </CashierLocked>
);

describe('WalletDeposit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render crypto module when wallet is crypto', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: true,
                },
            },
        });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({ mutate: jest.fn() });
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText(/MockedDepositCryptoModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositFiatModule/)).not.toBeInTheDocument();
    });

    it('should render fiat module when wallet is fiat', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: false,
                },
            },
        });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({ mutate: jest.fn() });
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText(/MockedDepositFiatModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositCryptoModule/)).not.toBeInTheDocument();
    });

    it('should render loader while data is loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ undefined });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: true,
            mutate: jest.fn(),
        });
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render error screen for a specific crypto error', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: true,
                },
            },
        });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({
            error: { error: { code: 'CryptoSuspendedCurrency', message: 'Crypto Suspended Error' } },
            mutate: jest.fn(),
        });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText(/MockedDepositErrorScreen - Crypto Suspended Error/)).toBeInTheDocument();
    });

    it('should render error screen for a specific fiat error', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: false,
                },
            },
        });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            error: { error: { code: 'CashierForwardError', message: 'Fiat Error' } },
            mutate: jest.fn(),
        });
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText(/MockedDepositErrorScreen - Fiat Error/)).toBeInTheDocument();
    });
});
