import React from 'react';
import SkeletonCard from 'Components/skeleton-card';
import WalletCard from 'Components/wallet';
import './selected-wallet.scss';

type SelectedWalletProps = {
    selected_wallet?: string;
};

const SelectedWallet = ({ selected_wallet }: SelectedWalletProps) => {
    return (
        <div className='selected-wallet'>
            {selected_wallet && <WalletCard size='large' wallet_name={selected_wallet} balance='0.00' />}
            {!selected_wallet && <SkeletonCard label='Choose a wallet' should_highlight />}
        </div>
    );
};

export default SelectedWallet;
