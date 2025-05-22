import React, { PropsWithChildren } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import useAllBalanceSubscription from '../../../../../hooks/useAllBalanceSubscription';
import { CashierLocked, WithdrawalLocked } from '../../../modules';
import WalletWithdrawal from '../WalletWithdrawal';

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletLoader: () => <div>Loading...</div>,
}));

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    SystemMaintenance: jest.fn(({ children }) => <>{children}</>),
    WithdrawalCryptoModule: jest.fn(({ verificationCode }) => {
        return (
            <>
                <div>WithdrawalCryptoModule</div>
                <div>verificationCode={verificationCode}</div>
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

jest.mock('../../../screens', () => ({
    ...jest.requireActual('../../../screens'),
    WithdrawalNoBalance: jest.fn(() => <div>WithdrawalNoBalance</div>),
}));

const mockSwitchAccount = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(() => ({ switchAccount: mockSwitchAccount })),
    useBalance: jest.fn(),
}));

jest.mock('../../../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: {
            CR42069: {
                balance: 100,
                converted_amount: 100,
                currency: 'USD',
                demo_account: 0,
                status: 1,
                type: 'deriv',
            },
            CR69420: {
                balance: 50,
                converted_amount: 50,
                currency: 'USD',
                demo_account: 0,
                status: 1,
                type: 'deriv',
            },
        },
        isLoading: false,
        setBalanceData: jest.fn(),
    }))
);

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;
const mockUseAllBalanceSubscription = useAllBalanceSubscription as jest.MockedFunction<
    typeof useAllBalanceSubscription
>;

const wrapper = ({ children }: PropsWithChildren) => (
    <CashierLocked>
        <WithdrawalLocked>{children}</WithdrawalLocked>
    </CashierLocked>
);

describe('WalletWithdrawal', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?verification=1234&loginid=CR42069'),
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
    });

    it('calls switch account for the loginid in url params', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
                loginid: 'CR69420',
            },
        });

        render(<WalletWithdrawal />, { wrapper });

        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
        expect(mockSwitchAccount).toHaveBeenCalledWith('CR42069');
    });

    it('removes the `verification` param from the window url', () => {
        const replaceStateSpy = jest.spyOn(window.history, 'replaceState');
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });

    it('renders withdrawal email verification page if no verification code found', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect'),
            writable: true,
        });

        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('renders withdrawal fiat module if withdrawal is for `doughflow` provider', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency: 'USD',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: {
                    platform: { cashier: ['doughflow'], ramp: [] },
                },
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalFiatModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('renders withdrawal crypto module if withdrawal is for `crypto` provider', async () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency: 'BTC',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: { platform: { cashier: ['crypto'], ramp: [] } },
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalCryptoModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('shows loader if verification code is activeWallet data has not been received yet', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseActiveWalletAccount.mockReturnValue({});
        (mockUseAllBalanceSubscription as jest.Mock).mockReturnValue({ data: undefined, isLoading: true });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders WithdrawalNoBalance screen if the wallet balance has zero balance', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency: 'BTC',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: { is_crypto: true },
                loginid: 'CR42069',
            },
        });

        (mockUseAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                CR42069: {
                    balance: 0,
                    converted_amount: 0,
                    currency: 'BTC',
                    demo_account: 0,
                    status: 1,
                    type: 'deriv',
                },
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalNoBalance')).toBeInTheDocument();
    });
});
