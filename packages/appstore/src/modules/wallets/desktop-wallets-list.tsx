import React from 'react';
import { useWalletsList } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import Wallet from 'Components/containers/wallet';

const DesktopWalletsList = observer(() => {
    const { data } = useWalletsList();

    return (
        <React.Fragment>
            {data?.map(wallet => (
                <Wallet key={wallet.loginid} wallet_account={wallet} />
            ))}
        </React.Fragment>
    );
});

export default DesktopWalletsList;
