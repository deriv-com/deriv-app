import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { AccountsList } from '../AccountsList';
import { WalletListCard } from '../WalletListCard';
import { WalletsAccordion } from '../WalletsAccordion';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: wallet_accounts_list } = useWalletAccountsList();

    return (
        <div className='wallets-desktop-wallets-list'>
            {wallet_accounts_list?.map(account => {
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
