import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import CreateWallet from './create-wallet';
import './create-wallet.scss';

type TProps = {
    dark: boolean;
    should_show_fiat: boolean;
    setShouldShowFiat: (show: boolean) => void;
    setSeletedWallet: (wallet: string) => void;
    selected_wallet?: string;
};

const CreateWalletWrapper = ({
    dark,
    should_show_fiat,
    setShouldShowFiat,
    setSeletedWallet,
    selected_wallet,
}: TProps) => {
    const { wallet_store } = useStores();

    React.useEffect(() => {
        wallet_store.onMount();
    }, []);

    const wallets = should_show_fiat ? wallet_store.wallet_provider.fiat_wallets : wallet_store.wallet_provider.wallets;

    return (
        <CreateWallet
            dark={dark}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={setSeletedWallet}
            selected_wallet={selected_wallet}
            wallets={wallets}
        />
    );
};

export default observer(CreateWalletWrapper);
