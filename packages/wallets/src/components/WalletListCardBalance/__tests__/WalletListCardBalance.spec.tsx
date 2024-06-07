import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { TSubscribedBalance } from '../../../types';
import WalletListCardBalance from '../WalletListCardBalance';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

const mockBalanceData: TSubscribedBalance['balance'] = {
    data: {
        accounts: {
            123: {
                balance: 100,
                converted_amount: 0,
                currency: 'USD',
                demo_account: 0,
                status: 0,
                type: 'deriv',
            },
        },
        balance: 9990,
        currency: 'USD',
        loginid: 'CRW1314',
    },
    error: undefined,
    isIdle: false,
    isLoading: false,
    isSubscribed: false,
};

describe('WalletListCardBalance', () => {
    it('displays the loader when the balance is loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: null,
            isInitializing: true,
        });

        mockBalanceData.isLoading = true;

        render(<WalletListCardBalance balance={mockBalanceData} />);

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

        mockBalanceData.isLoading = false;

        render(<WalletListCardBalance balance={mockBalanceData} />);
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
});
