import React from 'react';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WalletWithdrawal from '../WalletWithdrawal';

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    WithdrawalCryptoModule: jest.fn(() => <div>WithdrawalCryptoModule</div>),
    WithdrawalFiatModule: jest.fn(() => <div>WithdrawalFiatModule</div>),
    WithdrawalVerificationModule: jest.fn(() => <div>WithdrawalVerificationModule</div>),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useActiveWalletAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;

const mockUseCurrencyConfig = useCurrencyConfig as jest.MockedFunction<typeof useCurrencyConfig>;

describe('<WalletWithdrawal />', () => {
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

    xit('remove the `verification` param from the url', () => {
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

        delete global.window.location;
        global.window.location = new URL('http://localhost/redirect?verification=0987');
        render(<WalletWithdrawal />);
        expect(location.toString()).toEqual('http://localhost/redirect');
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

        render(<WalletWithdrawal />);
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

        render(<WalletWithdrawal />);
        expect(screen.getByText('WithdrawalFiatModule')).toBeInTheDocument();
    });

    it('should render withdrawal crypto module if withdrawal is for crypto wallet', () => {
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

        render(<WalletWithdrawal />);
        expect(screen.getByText('WithdrawalCryptoModule')).toBeInTheDocument();
    });
});
