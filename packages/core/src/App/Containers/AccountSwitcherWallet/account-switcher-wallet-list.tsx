import React from 'react';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import { TStores } from '@deriv/stores/types';
import './account-switcher-wallet-list.scss';

type TAccountSwitcherWalletListProps = {
    wallets: TStores['client']['wallet_list'];
    closeAccountsDialog: () => void;
};

export const AccountSwitcherWalletList = ({ wallets, closeAccountsDialog }: TAccountSwitcherWalletListProps) => (
    <div className='account-switcher-wallet-list'>
        {wallets?.map(account => {
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
