import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer } from '@deriv/stores';
import { useWalletList } from '@deriv/hooks';
import { Loading } from '@deriv/components';
import AddMoreWallets from 'Components/add-more-wallets';

const AccountWithWallets = observer(() => {
    const { data, isLoading } = useWalletList();
    const [selected_wallet, setSelectedWallet] = React.useState<NonNullable<typeof data>[number]['loginid']>();

    if (isLoading) return <Loading is_fullscreen={false} />;

    return (
        <React.Fragment>
            {data?.map(wallet => {
                return (
                    <Wallet
                        key={wallet.loginid}
                        wallet_account={wallet}
                        active={selected_wallet === wallet.loginid}
                        setActive={() =>
                            setSelectedWallet(previous => (previous === wallet.loginid ? undefined : wallet.loginid))
                        }
                    />
                );
            })}
            <AddMoreWallets />
        </React.Fragment>
    );
});

export default AccountWithWallets;
