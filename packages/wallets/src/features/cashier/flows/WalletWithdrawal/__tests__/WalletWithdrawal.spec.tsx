import React, { PropsWithChildren } from 'react';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { CashierLocked, WithdrawalLocked } from '../../../modules';
import WalletWithdrawal from '../WalletWithdrawal';

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    WithdrawalCryptoModule: jest.fn(({ onClose, verificationCode }) => {
        return (
            <>
                <div>WithdrawalCryptoModule</div>
                <div>verificationCode={verificationCode}</div>
                <button onClick={onClose}>close</button>
            </>
        );
    }),
    WithdrawalFiatModule: jest.fn(({ verificationCode }) => (
        <>
            <div>WithdrawalFiatModule</div>
            <div>verificationCode={verificationCode}</div>
        </>
    )),
    WithdrawalLocked: jest.fn(({ children }) => <>{children}</>),
    WithdrawalVerificationModule: jest.fn(() => <div>WithdrawalVerificationModule</div>),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    Loader: jest.fn(() => <div>Loading</div>),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;

const mockUseCurrencyConfig = useCurrencyConfig as jest.MockedFunction<typeof useCurrencyConfig>;

const wrapper = ({ children }: PropsWithChildren) => (
    <CashierLocked>
        <WithdrawalLocked>{children}</WithdrawalLocked>
    </CashierLocked>
);

describe('WalletWithdrawal', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?verification=1234'),
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
    });

    it('should remove the `verification` param from the window url', () => {
        const replaceStateSpy = jest.spyOn(window.history, 'replaceState');
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: true,
        });

        render(<WalletWithdrawal />, { wrapper });

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });

    it('should render withdrawal email verification page if no verification code found', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect'),
            writable: true,
        });

        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: true,
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('should render withdrawal fiat module if withdrawal is for fiat wallet', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        mockUseCurrencyConfig.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getConfig: jest.fn(() => ({ is_fiat: true })),
            isSuccess: true,
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalFiatModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('should render withdrawal crypto module if withdrawal is for crypto wallet', async () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'BTC',
            },
        });

        mockUseCurrencyConfig.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getConfig: jest.fn(() => ({ is_fiat: false })),
            isSuccess: true,
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalCryptoModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('should render withdrawal email verification module when onClose is triggered on the withdrawal crypto module', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'BTC',
            },
        });

        mockUseCurrencyConfig.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getConfig: jest.fn(() => ({ is_fiat: false })),
            isSuccess: true,
        });

        render(<WalletWithdrawal />, { wrapper });
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('should show loader if verification code is there but currency config is yet to be loaded', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'BTC',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: false,
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
