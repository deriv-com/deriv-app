import React from 'react';
import CreateWallet from 'Components/create-wallet';

type WalletStepProps = {
    wallet_type?: string;
    onSelect: (selected_wallet: string) => void;
};

const WalletStep = ({ wallet_type, onSelect }: WalletStepProps) => {
    const [should_show_fiat, setShouldShowFiat] = React.useState(false);

    return (
        <CreateWallet
            dark={false}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={onSelect}
            selected_wallet={wallet_type}
        />
    );
};

export default WalletStep;
