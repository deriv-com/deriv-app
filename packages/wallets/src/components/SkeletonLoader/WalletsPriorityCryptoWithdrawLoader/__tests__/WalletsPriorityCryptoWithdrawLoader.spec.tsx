import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletsPriorityCryptoWithdrawLoader from '../WalletsPriorityCryptoWithdrawLoader';

describe('WalletsPriorityCryptoWithdrawLoader', () => {
    it('should render WalletsPriorityCryptoWithdrawLoader', () => {
        render(<WalletsPriorityCryptoWithdrawLoader />);
        expect(screen.getByTestId('wallets_priority_crypto_withdrawal_loader')).toBeInTheDocument();
    });
});
