import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { AccountsList } from '../AccountsList';
import { WalletListCard } from '../WalletListCard';
import { WalletsAccordion } from '../WalletsAccordion';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data } = useWalletAccountsList();

    return (
        <div className='wallets-desktop-wallets-list'>
            {data?.map(wallet => (
                <WalletsAccordion
                    key={wallet.loginid}
                    wallet={wallet}
                    header={<WalletListCard account={wallet} />}
                    content={<AccountsList />}
                />
            ))}
        </div>
    );
};

export default DesktopWalletsList;
