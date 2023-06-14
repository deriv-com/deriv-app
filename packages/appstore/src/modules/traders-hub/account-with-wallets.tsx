import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer } from '@deriv/stores';
import { useWalletList } from '@deriv/hooks';
import { Loading } from '@deriv/components';

const AccountWithWallets = observer(() => {
    const { data } = useWalletList();

    if (!data) return <Loading is_fullscreen={false} />;

    return (
        <React.Fragment>
            {data?.map(wallet => (
                <Wallet key={wallet.loginid} data={wallet} />
            ))}
        </React.Fragment>
    );
});

export default AccountWithWallets;
