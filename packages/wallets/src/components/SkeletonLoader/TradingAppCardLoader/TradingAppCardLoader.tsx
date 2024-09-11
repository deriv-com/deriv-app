import React from 'react';
import './TradingAppCardLoader.scss';

const TradingAppCardLoader: React.FC = () => (
    <div className='wallets-trading-app-card-loader'>
        <div className='wallets-trading-app-card-loader__content'>
            <div className='wallets-skeleton wallets-trading-app-card-loader__content__icon' />
            <div className='wallets-trading-app-card-loader__content__details'>
                <div className='wallets-skeleton wallets-trading-app-card-loader__content__details--title' />
                <div className='wallets-skeleton wallets-trading-app-card-loader__content__details--description' />
            </div>
        </div>
    </div>
);

export default TradingAppCardLoader;
