import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer } from '@deriv/stores';
import { useWalletList } from '@deriv/hooks';
import { Loading } from '@deriv/components';

const AccountWithWallets = observer(() => {
    const { data, isLoading, error } = useWalletList();
    const [selected_wallet, setSelectedWallet] = React.useState('');

    if (isLoading) return <Loading is_fullscreen={false} />;

    if (error) return <p>{JSON.stringify(error)}</p>;

    return (
        <React.Fragment>
            {data?.map(wallet => {
                return (
                    <Wallet
                        key={wallet.loginid}
                        wallet_account={wallet}
                        active={selected_wallet === wallet.loginid}
                        setActive={() =>
                            setSelectedWallet(prevWallet => (prevWallet === wallet.loginid ? '' : wallet.loginid || ''))
                        }
                    />
                );
            })}
        </React.Fragment>
    );
});

export default AccountWithWallets;
