import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton } from '../../../../components';

type TGetMessageProps = {
    currency: string;
    hasAccountsForTransfer: boolean;
    hasTransferAccountsWithFunds: boolean;
    history: ReturnType<typeof useHistory>;
};

const getMessage = ({ currency, hasAccountsForTransfer, hasTransferAccountsWithFunds, history }: TGetMessageProps) => {
    if (!hasAccountsForTransfer) {
        return {
            actionButton: () => (
                <WalletButton
                    onClick={() => history.push('/wallets')}
                    size='lg'
                    text="Back to Trader's hub"
                    variant='contained'
                />
            ),
            description: "Add a trading account or Wallet in Trader's hub to receive funds from this Wallet.",
            title: 'No trading accounts or other wallets are available to receive funds',
        };
    }

    if (!hasTransferAccountsWithFunds) {
        return {
            actionButton: () => (
                <WalletButton
                    onClick={() => history.push('/wallets/cashier/deposit')}
                    size='lg'
                    text='Deposit'
                    variant='contained'
                />
            ),
            description: `Please make a deposit to your ${currency} Wallet to make a transfer.`,
            title: 'No funds in any trading accounts or wallets',
        };
    }
};

export default getMessage;
