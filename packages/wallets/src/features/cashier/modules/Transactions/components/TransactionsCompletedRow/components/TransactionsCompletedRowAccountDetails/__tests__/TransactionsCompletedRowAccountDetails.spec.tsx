import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionsCompletedRowAccountDetails from '../TransactionsCompletedRowAccountDetails';

jest.mock('../../../../../../../helpers', () => ({
    getMarketType: jest.fn(),
}));

const defaultProps = {
    accountType: 'real',
    actionType: 'deposit' as const,
    currency: 'USD',
    displayAccountName: 'USD Wallet',
    displayActionType: 'Deposit',
    isDemo: false,
    mt5Group: 'mocked mt5 group',
    transactionID: 9900,
};

describe('TransactionsCompletedRowAccountDetails', () => {
    it('renders correct default content', () => {
        render(<TransactionsCompletedRowAccountDetails {...defaultProps} />);

        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Ref. ID')).toBeInTheDocument();
        expect(screen.getByText('9900')).toBeInTheDocument();
    });

    it('renders WalletCurrencyCard when action type is not transfer or is inter wallet', () => {
        render(<TransactionsCompletedRowAccountDetails {...defaultProps} />);

        expect(screen.getByTestId('dt_wallet_currency_icon')).toBeInTheDocument();
    });

    it('renders WalletMarketCurrencyIcon when action type is transfer and is not inter wallet', () => {
        render(
            <TransactionsCompletedRowAccountDetails {...defaultProps} actionType='transfer' isInterWallet={false} />
        );

        expect(screen.getByTestId('dt_wallet_market_icon')).toBeInTheDocument();
    });

    it('does not render WalletListCardBadge for demo account', () => {
        render(<TransactionsCompletedRowAccountDetails {...defaultProps} isDemo={true} />);

        expect(screen.queryByTestId('dt_wallet_list_card_badge')).not.toBeInTheDocument();
    });
});
