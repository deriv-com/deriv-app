import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletListCard from '../WalletListCard';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            is_virtual: false,
        },
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../WalletListCardDetails/WalletListCardDetails', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardDetails</div>),
}));

jest.mock('../../WalletCurrencyCard', () => ({
    WalletCurrencyCard: jest.fn(() => <div>Mocked WalletCurrencyCard</div>),
}));

describe('WalletListCard', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with components correctly', () => {
        render(<WalletListCard />);

        expect(screen.getByText('Mocked WalletCurrencyCard')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardDetails')).toBeInTheDocument();
    });

    it('should render with components correctly for demo account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        render(<WalletListCard />);

        expect(screen.getByText('Mocked WalletCurrencyCard')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardDetails')).toBeInTheDocument();
    });
});
