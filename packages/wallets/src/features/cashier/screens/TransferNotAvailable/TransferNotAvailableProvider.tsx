import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
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
        const title = isVirtual ? (
            <Localize i18n_default_text='No trading accounts are available to receive funds' />
        ) : (
            <Localize i18n_default_text='No trading accounts or other wallets are available to receive funds' />
        );
        const description = isVirtual ? (
            <Localize i18n_default_text="Add a demo trading account in Trader's hub to receive funds from this Wallet to start trading." />
        ) : (
            <Localize i18n_default_text="Add a trading account or Wallet in Trader's hub to receive funds from this Wallet." />
        );

        return {
            actionButton: () => (
                <Button borderWidth='sm' onClick={() => history.push('/')} size='lg' textSize='md'>
                    <Localize i18n_default_text="Back to Trader's hub" />
                </Button>
            ),
            description,
            title,
        };
    }

    if (!hasTransferAccountsWithFunds) {
        const title = isVirtual ? (
            <Localize i18n_default_text='No funds in Demo wallet and demo trading accounts' />
        ) : (
            <Localize i18n_default_text='No funds in any trading accounts or wallets' />
        );
        const description = isVirtual ? (
            <Localize i18n_default_text='Please reset the balance of your Demo Wallet to make a transfer.' />
        ) : (
            <Localize
                i18n_default_text='Please make a deposit to your {{currency}} Wallet to make a transfer.'
                values={{ currency }}
            />
        );
        const locationPathName = `/wallet/${isVirtual ? 'reset-balance' : 'deposit'}` as const;
        const buttonText = isVirtual ? (
            <Localize i18n_default_text='Reset balance' />
        ) : (
            <Localize i18n_default_text='Deposit' />
        );

        return {
            actionButton: () => (
                <Button borderWidth='sm' onClick={() => history.push(locationPathName)} size='lg' textSize='md'>
                    {buttonText}
                </Button>
            ),
            description,
            title,
        };
    }
};

export default getMessage;
