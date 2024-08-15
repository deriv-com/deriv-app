import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import useAllBalanceSubscription from '../../../hooks/useAllBalanceSubscription';
import WalletListCardBalance from '../WalletListCardBalance';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../../../hooks/useAllBalanceSubscription', () => jest.fn());

describe('WalletListCardBalance', () => {
    it('displays the loader when the balance is loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({
            data: null,
            isInitializing: true,
        });

        (useAllBalanceSubscription as jest.Mock).mockReturnValue({ isLoading: true });

        render(<WalletListCardBalance />);

        expect(screen.getByTestId('dt_wallet_list_card_balance_loader')).toBeInTheDocument();
    });

    it('displays the balance when the balance is not loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                currency_config: { fractional_digits: 2 },
                loginid: '123',
            },
            isInitializing: false,
        });

        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                '123': {
                    balance: 100,
                },
            },
            setBalanceData: jest.fn(),
        });

        render(<WalletListCardBalance />);
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
});
