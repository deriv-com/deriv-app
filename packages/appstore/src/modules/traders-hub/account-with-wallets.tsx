import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer } from '@deriv/stores';
import { useWalletsList } from '@deriv/hooks';

const AccountWithWallets = observer(() => {
    const { data } = useWalletsList();

    return (
        <React.Fragment>
            {data?.map(wallet => (
                <Wallet key={wallet.loginid} wallet_account={wallet} />
            ))}
        </React.Fragment>
    );
});

export default AccountWithWallets;
