import React from 'react';
import CreateWallet from 'Components/create-wallet';

type WalletStepProps = {
    selected_wallet: string;
    onSelect: (selected_wallet: string) => void;
};

const WalletStep = ({ selected_wallet, onSelect }: WalletStepProps) => {
    const [should_show_fiat, setShouldShowFiat] = React.useState(false);

    return (
        <CreateWallet
            dark={false}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={onSelect}
            selected_wallet={selected_wallet}
        />
    );
};

export default WalletStep;
