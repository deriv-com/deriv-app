import React from 'react';
import { useWalletAccountsList } from '@deriv/hooks';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import './account-switcher-wallet-list.scss';

type TAccountSwitcherWalletListProps = {
    wallets: ReturnType<typeof useWalletAccountsList>['data'];
    closeAccountsDialog: () => void;
};

export const AccountSwitcherWalletList = ({ wallets, closeAccountsDialog }: TAccountSwitcherWalletListProps) => (
    <div className='account-switcher-wallet__list'>
        {wallets?.map(account => {
            const show_badge = account?.is_malta_wallet || account?.is_virtual;
            return (
                <AccountSwitcherWalletItem
                    key={account.dtrade_loginid}
                    account={account}
                    closeAccountsDialog={closeAccountsDialog}
                    show_badge={show_badge}
                />
            );
        })}
    </div>
);
