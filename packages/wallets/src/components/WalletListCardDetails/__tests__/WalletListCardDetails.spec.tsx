import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { TSubscribedBalance } from '../../../types';
import WalletListCardDetails from '../WalletListCardDetails';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            is_virtual: false,
        },
        isLoading: false,
    })),
}));

jest.mock('../../WalletListCardActions/WalletListCardActions', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardActions</div>),
}));

jest.mock('../../WalletListCardBalance/WalletListCardBalance', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardBalance</div>),
}));

jest.mock('../../WalletListCardDropdown/WalletListCardDropdown', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardDropdown</div>),
}));

const mockBalanceData: TSubscribedBalance['balance'] = {
    data: {
        accounts: {
            1234567: {
                balance: 1000.0,
                converted_amount: 1000.0,
                currency: 'USD',
                demo_account: 0,
                status: 1,
                type: 'deriv',
            },
            7654321: {
                balance: 1.0,
                converted_amount: 1.0,
                currency: 'BTC',
                demo_account: 1,
                status: 1,
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

describe('WalletListCardDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default components correctly for real account', () => {
        render(<WalletListCardDetails balance={mockBalanceData} />);

        expect(screen.getByText('Mocked WalletListCardActions')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardBalance')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardDropdown')).toBeInTheDocument();
    });

    it('should render with default components correctly for demo account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        render(<WalletListCardDetails balance={mockBalanceData} />);

        expect(screen.getByText('Mocked WalletListCardActions')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardBalance')).toBeInTheDocument();
        expect(screen.getByText('USD Demo Wallet')).toBeInTheDocument();
    });
});
