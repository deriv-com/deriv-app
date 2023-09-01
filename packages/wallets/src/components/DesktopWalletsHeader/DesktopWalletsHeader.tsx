import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import WalletListCard from '../WalletListCard/WalletListCard';

const DesktopWalletsHeader: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1>No wallets found</h1>;

    return (
        <React.Fragment>
            {data?.map(account => {
                return <WalletListCard account={account} key={account.loginid} />;
            })}
        </React.Fragment>
    );
};

export default DesktopWalletsHeader;
