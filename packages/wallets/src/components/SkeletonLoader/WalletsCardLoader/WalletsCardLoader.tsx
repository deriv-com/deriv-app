import React from 'react';
import './WalletsCardLoader.scss';

const WalletsCardLoader = () => {
    return (
        <div className='wallets-card-loader' data-testid='dt_wallets_card_loader'>
            <div className='wallets-skeleton wallets-card-loader__item wallets-card-loader__item-expanded' />
        </div>
    );
};

export default WalletsCardLoader;
