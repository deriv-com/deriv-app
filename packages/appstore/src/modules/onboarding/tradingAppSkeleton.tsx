import React from 'react';
import './tradingAppSkeleton.scss';

const TradingAppCardSkeleton = () => {
    return (
        <div className='trading-app-card-loader'>
            <div className='trading-app-card-loader__content'>
                <div className='skeleton-loader trading-app-card-loader__content__icon' />
                <div className='trading-app-card-loader__content__details'>
                    <div className='skeleton-loader trading-app-card-loader__content__details--title' />
                    <div className='skeleton-loader trading-app-card-loader__content__details--description' />
                </div>
                <div className='skeleton-loader trading-app-card-loader__content__button' />
            </div>
        </div>
    );
};

export default TradingAppCardSkeleton;
