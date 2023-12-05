import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton } from '../../../../components';
import { THooks } from '../../../../types';

type TGetMessageProps = {
    currency: string;
    hasAccountsForTransfer: boolean;
    hasTransferAccountsWithFunds: boolean;
    history: ReturnType<typeof useHistory>;
    isVirtual?: THooks.ActiveWalletAccount['is_virtual'];
};

const getMessage = ({
    currency,
    hasAccountsForTransfer,
    hasTransferAccountsWithFunds,
    history,
    isVirtual,
}: TGetMessageProps) => {
    if (!hasAccountsForTransfer) {
        const title = isVirtual
            ? 'No trading accounts are available to receive funds'
            : 'No trading accounts or other wallets are available to receive funds';
        const description = isVirtual
            ? "Add a demo trading account in Trader's hub to receive funds from this Wallet to start trading."
            : "Add a trading account or Wallet in Trader's hub to receive funds from this Wallet.";

        return {
            actionButton: () => (
                <WalletButton onClick={() => history.push('/wallets')} size='lg'>
                    Back to Trader&apos;s hub
                </WalletButton>
            ),
            description,
            title,
        };
    }

    if (!hasTransferAccountsWithFunds) {
        const title = isVirtual
            ? 'No funds in Demo wallet and demo trading accounts'
            : 'No funds in any trading accounts or wallets';
        const description = isVirtual
            ? 'Please reset the balance of your Demo Wallet to make a transfer.'
            : `Please make a deposit to your ${currency} Wallet to make a transfer.`;
        const locationPathName = `wallets/cashier/${isVirtual ? 'reset-balance' : 'deposit'}`;
        const buttonText = isVirtual ? 'Reset balance' : 'Deposit';

        return {
            actionButton: () => (
                <WalletButton onClick={() => history.push(locationPathName)} size='lg'>
                    {buttonText}
                </WalletButton>
            ),
            description,
            title,
        };
    }
};

export default getMessage;
