import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletDeposit from '../WalletDeposit';

const mockSwitchAccount = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(() => ({ switchAccount: mockSwitchAccount })),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;

jest.mock('../../../modules', () => ({
    DepositCryptoModule: jest.fn(() => <div>MockedDepositCryptoModule</div>),
    DepositFiatModule: jest.fn(() => <div>MockedDepositFiatModule</div>),
}));

describe('WalletDeposit', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?loginid=CR42069'),
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
        jest.clearAllMocks();
    });

    it('should render crypto module when wallet is crypto', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: {
                    is_crypto: true,
                },
                loginid: 'CR69420',
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositCryptoModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositFiatModule/)).not.toBeInTheDocument();
    });

    it('should render fiat module when wallet is fiat', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: {
                    is_crypto: false,
                },
                loginid: 'CR69420',
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositFiatModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositCryptoModule/)).not.toBeInTheDocument();
    });

    it('should call switch account for the loginid in url params', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: {
                    is_crypto: true,
                },
                loginid: 'CR69420',
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositCryptoModule/)).toBeInTheDocument();
        expect(mockSwitchAccount).toHaveBeenCalledWith('CR42069');
    });

    it('should remove the `loginid` param from the window url', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: {
                    is_crypto: true,
                },
                loginid: 'CR69420',
            },
        });
        const replaceStateSpy = jest.spyOn(window.history, 'replaceState');

        render(<WalletDeposit />);

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });
});
