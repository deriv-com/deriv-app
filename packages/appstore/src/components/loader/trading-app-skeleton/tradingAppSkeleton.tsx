import React from 'react';
import './tradingAppSkeleton.scss';
import { HorizentalDevider } from '../devider/devider';

const TradingAppCardSkeleton = () => {
    return (
        <div className='trading-app-card-loader'>
            <div className='skeleton-loader trading-app-card-loader__icon' />
            <div className='trading-app-card-loader__container'>
                <div className='trading-app-card-loader__container__content'>
                    <div className='trading-app-card-loader__container__content--details'>
                        <div className='skeleton-loader trading-app-card-loader__container__content--details__title' />
                        <div className='skeleton-loader trading-app-card-loader__container__content--details__description' />
                    </div>
                    <div className='skeleton-loader trading-app-card-loader__container__content--button' />
                </div>
                <HorizentalDevider />
            </div>
        </div>
    );
};

export default TradingAppCardSkeleton;
