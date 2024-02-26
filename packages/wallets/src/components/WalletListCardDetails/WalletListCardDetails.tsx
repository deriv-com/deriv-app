import React from 'react';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import { WalletListCardBalance } from '../WalletListCardBalance';
import WalletListCardDropdown from '../WalletListCardDropdown/WalletListCardDropdown';
import './WalletListCardDetails.scss';

const WalletListCardDetails = () => (
    <div className='wallets-list-details__container'>
        <WalletListCardDropdown />
        <div className='wallets-list-details__content'>
            <WalletListCardBalance />
            <WalletListCardActions />
        </div>
    </div>
);

export default WalletListCardDetails;
