import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { AccountsList, WalletListCard, WalletsAccordion } from '..';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: wallet_accounts_list } = useWalletAccountsList();

    if (!wallet_accounts_list.length) return <h1>No wallets found</h1>;

    return (
        <div className='wallets-desktop-wallets-list'>
            {wallet_accounts_list.map(account => {
                return (
                    <WalletsAccordion
                        key={`wallets-accordion-${account.loginid}`}
                        account={account}
                        content={<AccountsList />}
                        header={<WalletListCard account={account} />}
                    />
                );
            })}
        </div>
    );
};

export default DesktopWalletsList;
