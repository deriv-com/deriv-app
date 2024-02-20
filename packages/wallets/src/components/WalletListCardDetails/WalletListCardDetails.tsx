import React from 'react';
import { THooks } from '../../types';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import { WalletListCardBalance } from '../WalletListCardBalance';
import WalletListCardDropdown from '../WalletListCardDropdown/WalletListCardDropdown';
import './WalletListCardDetails.scss';

type TProps = {
    balance: THooks.WalletAccountsList['display_balance'];
    isActive: THooks.WalletAccountsList['is_active'];
    isDemo: THooks.WalletAccountsList['is_virtual'];
    loginid: THooks.WalletAccountsList['loginid'];
    onAccountSelect: (loginid: string) => void;
};

const WalletListCardDetails: React.FC<TProps> = ({ balance, isActive, isDemo, loginid, onAccountSelect }) => (
    <div className='wallets-list-details__container'>
        <WalletListCardDropdown loginid={loginid} onAccountSelect={onAccountSelect} />
        <div className='wallets-list-details__content'>
            <WalletListCardBalance balance={balance} />
            <WalletListCardActions isActive={isActive} isDemo={isDemo} loginid={loginid} />
        </div>
    </div>
);

export default WalletListCardDetails;
