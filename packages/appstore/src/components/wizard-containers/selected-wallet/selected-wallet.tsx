import SkeletonCard from 'Components/skeleton-card';
import WalletCard from 'Components/wallet';
import React from 'react';
import { WizardContext } from '../context';

const SelectedWallet = () => {
    const { selected_wallet } = React.useContext(WizardContext);
    return (
        <div className='wallet-wizard-create-wallet-right-panel'>
            {selected_wallet && <WalletCard size='large' wallet_name={selected_wallet} />}
            {!selected_wallet && <SkeletonCard label='Choose a wallet' should_highlight />}
        </div>
    );
};

export default SelectedWallet;
