import React from 'react';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import { TStores } from '@deriv/stores/types';
import './account-switcher-wallet-list.scss';

type TAccountSwitcherWalletListProps = {
    wallets: TStores['client']['wallet_list'];
    closeAccountsDialog: () => void;
};

export const AccountSwitcherWalletList = ({ wallets, closeAccountsDialog }: TAccountSwitcherWalletListProps) => {
    // Sort wallets by available balance (highest first)
    const sortedWallets = [...(wallets || [])].sort((a, b) => {
        // Handle cases where dtrade_balance might be undefined or null
        const balance_a = a.dtrade_balance || 0;
        const balance_b = b.dtrade_balance || 0;

        // Sort in descending order (highest first)
        return balance_b - balance_a;
    });

    return (
        <div className='account-switcher-wallet-list'>
            {sortedWallets?.map(account => {
                if (account.is_dtrader_account_disabled) return null;
                return (
                    <AccountSwitcherWalletItem
                        key={account.dtrade_loginid}
                        account={account}
                        closeAccountsDialog={closeAccountsDialog}
                        show_badge={account?.is_virtual}
                    />
                );
            })}
        </div>
    );
};
