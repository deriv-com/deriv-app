import React, { useEffect } from 'react';
import { Loading } from '@deriv/components';
import { useActiveWallet, useWalletsList } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import AddMoreWallets from 'Components/add-more-wallets';
import Wallet from 'Components/containers/wallet';
import ModalManager from 'Components/modals/modal-manager';
import './wallets.scss';

const Wallets = observer(() => {
    const { client } = useStore();
    const { switchAccount, is_authorize } = client;
    const { data } = useWalletsList();
    const active_wallet = useActiveWallet();

    useEffect(() => {
        if (!active_wallet && data && data?.length) {
            switchAccount(data[0].loginid);
        }
    }, [active_wallet, data, switchAccount]);

    return (
        <div className={'wallets-module'}>
            {!is_authorize && <Loading />}
            {is_authorize && (
                <div className={'wallets-module__content'}>
                    {data?.map(wallet => (
                        <Wallet key={wallet.loginid} wallet_account={wallet} />
                    ))}
                    <AddMoreWallets />
                </div>
            )}
            <ModalManager />
        </div>
    );
});

export default Wallets;
