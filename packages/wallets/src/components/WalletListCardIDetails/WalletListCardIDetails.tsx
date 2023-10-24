import React from 'react';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';
import WalletListCardTitle from '../WalletListCardTitle/WalletListCardTitle';
import './WalletListCardIDetails.scss';

type TProps = {
    badge?: string;
    currency: string;
    isActive: boolean;
    isDemo: boolean;
    loginid: string;
    title: string;
};

const WalletListCardIDetails: React.FC<TProps> = ({ badge, isActive, isDemo, loginid, title }) => (
    <div className='wallets-list-details__action-container'>
        <div className='wallets-list-details__elements'>
            <WalletListCardTitle title={title} />
            {badge && <WalletListCardBadge isDemo={isDemo} label={badge} />}
        </div>
        <WalletListCardActions isActive={isActive} isDemo={isDemo} loginid={loginid} />
    </div>
);

export default WalletListCardIDetails;
