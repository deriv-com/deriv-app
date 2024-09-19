import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletDeposit from '../WalletDeposit';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../../../modules', () => ({
    DepositCryptoModule: jest.fn(() => <div>MockedDepositCryptoModule</div>),
    DepositFiatModule: jest.fn(() => <div>MockedDepositFiatModule</div>),
}));

describe('WalletDeposit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders crypto module when cashier provider is `crypto`', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    platform: { cashier: ['crypto'] },
                },
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositCryptoModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositFiatModule/)).not.toBeInTheDocument();
    });

    it('renders fiat module when cashier provider is `doughflow`', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    platform: { cashier: ['doughflow'] },
                },
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositFiatModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositCryptoModule/)).not.toBeInTheDocument();
    });
});
