import * as React from 'react';
import { useStores } from 'Stores';
import { TWalletAccount } from 'Types';

import WalletAccount from 'Components/wallet-account';
import './trading-hub.scss';

const TradingHub = () => {
    const { client } = useStores();

    const wallet_accounts: TWalletAccount = client.wallet_accounts || [];

    return (
        <div className='trading-hub'>
            {wallet_accounts.map(account => (
                <WalletAccount key={account.created_at} account={account} />
            ))}
        </div>
    );
};

export default TradingHub;
