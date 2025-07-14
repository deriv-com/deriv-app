import React from 'react';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import { TStores } from '@deriv/stores/types';
import './account-switcher-wallet-list.scss';

type TAccountSwitcherWalletListProps = {
    wallets: TStores['client']['wallet_list'];
    closeAccountsDialog: () => void;
};

export const AccountSwitcherWalletList = ({ wallets, closeAccountsDialog }: TAccountSwitcherWalletListProps) => {
    // Sort wallets: real accounts by balance (highest first), then demo accounts by balance
    const sortedWallets = [...(wallets || [])].sort((a, b) => {
        // First, ensure demo accounts are always at the bottom
        if (a.is_virtual || b.is_virtual) {
            return a.is_virtual ? 1 : -1;
        }

        // For accounts of the same type (both real), sort by balance (highest first)
        const balance_a = a.dtrade_balance || 0;
        const balance_b = b.dtrade_balance || 0;
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
