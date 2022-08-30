import React from 'react';
import WalletCard from 'Components/wallet';
import './selected-wallet.scss';

type SelectedWalletProps = {
    selected_wallet: string;
};

const SelectedWallet = ({ selected_wallet }: SelectedWalletProps) => {
    return (
        <div className='selected-wallet'>
            <WalletCard size='large' wallet_name={selected_wallet} />
        </div>
    );
};

export default SelectedWallet;
