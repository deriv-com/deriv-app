import React from 'react';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';
import WalletListCardIActions from '../WalletListCardIActions/WalletListCardIActions';
import WalletListCardTitle from '../WalletListCardTitle/WalletListCardTitle';
import './WalletListCardIDetails.scss';

type TProps = {
    badge?: string;
    currency: string;
    isDemo: boolean;
};

const WalletListCardIDetails: React.FC<TProps> = ({ isDemo, currency, badge }) => (
    <div className='wallets-list-details__action-container'>
        <div className='wallets-list-details__elements'>
            <WalletListCardTitle currency={currency} />
            {!isDemo && badge && <WalletListCardBadge label={badge.toUpperCase()} />}
        </div>
        <WalletListCardIActions isDemo={isDemo} />
    </div>
);

export default WalletListCardIDetails;
