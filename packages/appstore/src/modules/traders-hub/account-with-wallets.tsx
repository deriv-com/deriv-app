import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer } from '@deriv/stores';
import { useWalletList } from '@deriv/hooks';

const AccountWithWallets = observer(() => {
    const { data, isLoading, error } = useWalletList();

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>{JSON.stringify(error)}</p>;

    return (
        <React.Fragment>
            {data?.map(wallet => (
                <Wallet key={wallet.loginid} wallet_account={wallet} />
            ))}
        </React.Fragment>
    );
});

export default AccountWithWallets;
