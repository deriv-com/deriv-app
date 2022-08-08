import * as React from 'react';
import { useStores } from 'Stores';
import { Authorize } from '@deriv/api-types';
import WalletAccount from 'Components/wallet-account';
import './trading-hub.scss';

const TradingHub = () => {
    const { client } = useStores();

    const wallet_accounts = (client.wallet_accounts || []) as Required<Authorize>['account_list'];

    return (
        <div className='trading-hub'>
            {wallet_accounts.map(account => {
                return <WalletAccount key={account.loginid} account={account} />;
            })}
        </div>
    );
};

export default TradingHub;
