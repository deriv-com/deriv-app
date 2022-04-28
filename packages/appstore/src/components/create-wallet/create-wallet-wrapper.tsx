import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'Stores';
import CreateWallet from './create-wallet';
import './create-wallet.scss';

type TProps = {
    is_dark_mode_on: boolean;
    should_show_fiat: boolean;
};

const CreateWalletWrapper = ({ is_dark_mode_on, should_show_fiat }: TProps) => {
    const { wallet_store } = useStores();

    React.useEffect(() => {
        wallet_store.onMount();

        return () => wallet_store.onUnmount();
    }, []);

    const wallets = should_show_fiat ? wallet_store.wallet_provider.fiat_wallets : wallet_store.wallet_provider.wallets;

    return <CreateWallet is_dark_mode_on={is_dark_mode_on} should_show_fiat={should_show_fiat} wallets={wallets} />;
};

export default observer(CreateWalletWrapper);
