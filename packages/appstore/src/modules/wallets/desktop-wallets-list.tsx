import React from 'react';
import { useWalletsList } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import Wallet from 'Components/containers/wallet';

const DesktopWalletsList = observer(() => {
    const { data } = useWalletsList();

    return (
        <>
            {data?.map(wallet => (
                <Wallet key={wallet.loginid} wallet_account={wallet} />
            ))}
        </>
    );
});

export default DesktopWalletsList;
