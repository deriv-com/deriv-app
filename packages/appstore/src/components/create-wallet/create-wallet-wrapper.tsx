import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'Stores';
import CreateWallet from './create-wallet';
import './create-wallet.scss';

type TProps = {
    is_dark_mode_on: boolean;
    should_show_fiat: boolean;
    setShouldShowFiat: (show: boolean) => void;
    setSeletedWallet: (wallet: string) => void;
    selected_wallet?: string;
    wallets: { getTitle: () => string; content: string[]; popover_text: () => string; has_information: boolean }[];
};

const CreateWalletWrapper = ({
    is_dark_mode_on,
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
            dark={is_dark_mode_on}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={setSeletedWallet}
            selected_wallet={selected_wallet}
            wallets={wallets}
        />
    );
};

export default observer(CreateWalletWrapper);
