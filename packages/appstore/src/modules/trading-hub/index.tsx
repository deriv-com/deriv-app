import * as React from 'react';
import { useStores } from 'Stores';
import { Authorize, TExtendedAccountList } from 'Types';

import WalletAccount from 'Components/wallet-account';
import './trading-hub.scss';

const TradingHub = () => {
    const { client } = useStores();

    const wallet_accounts: Authorize['account_list'] = client.wallet_accounts || [];

    return (
        <div className='trading-hub'>
            {wallet_accounts.map((wallet_account: TExtendedAccountList) => (
                <WalletAccount key={wallet_account.created_at} account={wallet_account} />
            ))}
        </div>
    );
};

export default TradingHub;
