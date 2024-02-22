import React, { PropsWithChildren } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { CashierLocked, DepositLocked } from '../../../screens';
import WalletDeposit from '../WalletDeposit';

jest.mock('../../../screens', () => ({
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    DepositLocked: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../../../modules', () => ({
    DepositCryptoModule: jest.fn(() => <div>MockedDepositCryptoModule</div>),
    DepositFiatModule: jest.fn(() => <div>MockedDepositFiatModule</div>),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <CashierLocked>
        <DepositLocked>{children}</DepositLocked>
    </CashierLocked>
);

describe('WalletDeposit', () => {
    it('should render crypto module when wallet is crypto', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({
            data: {
                currency_config: {
                    is_crypto: true,
                },
            },
        });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText(/MockedDepositCryptoModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositFiatModule/)).not.toBeInTheDocument();
    });

    it('should render fiat module when wallet is not crypto', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({
            data: {
                currency_config: {
                    is_crypto: false,
                },
            },
        });

        render(<WalletDeposit />, { wrapper });

        expect(screen.getByText(/MockedDepositFiatModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositCryptoModule/)).not.toBeInTheDocument();
    });
});
