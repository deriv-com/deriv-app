import React from 'react';
import { MainComponentProps } from '@deriv/ui';
import CreateWallet from 'Components/create-wallet';

const WalletStep = ({ onSubmit }: MainComponentProps) => {
    const { create_wallet } = useStores();
    const { selected_wallet, setSelectedWallet } = create_wallet;
    const [should_show_fiat, setShouldShowFiat] = React.useState(false);

    const handleSubmit = (wallet: string) => {
        setSelectedWallet(wallet);
        onSubmit({ wallet }, true);
    };

    return (
        <CreateWallet
            dark={false}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={handleSubmit}
            selected_wallet={selected_wallet}
        />
    );
};

export default WalletStep;
