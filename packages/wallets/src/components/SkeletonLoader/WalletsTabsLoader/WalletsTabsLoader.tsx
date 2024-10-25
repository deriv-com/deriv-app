import React from 'react';
import './WalletsTabsLoader.scss';

const WalletsTabsLoader: React.FC = () => {
    return (
        <div className='wallets-tabs-loader__wrapper' data-testid='dt_wallets_tabs_loader'>
            <div className='wallets-skeleton wallets-tabs-loader__tabs' />
            <div className='wallets-skeleton wallets-tabs-loader__description' />
            <div className='wallets-skeleton wallets-tabs-loader__list' />
        </div>
    );
};

export default WalletsTabsLoader;
