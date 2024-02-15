import React from 'react';
import { APIProvider, useBalance } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WalletListCardBalance from '../WalletListCardBalance';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useBalance: jest.fn(() => ({
        ...jest.requireActual('@deriv/api').useBalance(),
        isLoading: false,
    })),
}));

describe('WalletListCardBalance', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <APIProvider>{children}</APIProvider>;

    it('should show account balance', () => {
        render(<WalletListCardBalance balance={'100 USD'} />, { wrapper });
        expect(screen.getByText('100 USD')).toBeInTheDocument();
    });

    it('should show loader when balance has not been loaded', () => {
        (useBalance as jest.Mock).mockImplementationOnce(() => ({
            ...jest.requireActual('@deriv/api').useBalance(),
            isLoading: true,
        }));
        render(<WalletListCardBalance balance={'100 USD'} />, { wrapper });
        expect(screen.queryByText('100 USD')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_list_card_balance_loader')).toBeInTheDocument();
    });
});
