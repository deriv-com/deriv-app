import React from 'react';
import './WalletListCardBadge.scss';

type TProps = {
    label: string;
};

const WalletListCardBadge: React.FC<TProps> = ({ label }) => {
    if (label === 'virtual') {
        return (
            <div className='wallets-list-card__badge__virtual'>
                <p>Demo</p>
            </div>
        );
    }

    return (
        <div className='wallets-list-card__badge'>
            <div className='wallets-list-card__name'>
                <p>{label.toUpperCase()}</p>
            </div>
        </div>
    );
};

export default WalletListCardBadge;
