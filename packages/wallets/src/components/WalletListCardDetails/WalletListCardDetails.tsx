import React from 'react';
import { THooks } from '../../types';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';
import WalletListCardTitle from '../WalletListCardTitle/WalletListCardTitle';
import './WalletListCardDetails.scss';

type TProps = {
    badge?: THooks.WalletAccountsList['landing_company_name'];
    isActive: THooks.WalletAccountsList['is_active'];
    isDemo: THooks.WalletAccountsList['is_virtual'];
    loginid: THooks.WalletAccountsList['loginid'];
    title: Exclude<THooks.WalletAccountsList['currency'], undefined>;
};

const WalletListCardDetails: React.FC<TProps> = ({ badge, isActive, isDemo, loginid, title }) => (
    <div className='wallets-list-details__action-container'>
        <div className='wallets-list-details__elements'>
            <WalletListCardTitle title={title} />
            {badge && <WalletListCardBadge isDemo={isDemo} label={badge} />}
        </div>
        <WalletListCardActions isActive={isActive} isDemo={isDemo} loginid={loginid} />
    </div>
);

export default WalletListCardDetails;
