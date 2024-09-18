import React from 'react';
import { Text } from '@deriv-com/ui';
import './WalletsCarouselLoader.scss';

const WalletsCarouselLoader = () => (
    <div className='wallets-carousel-loader'>
        <div className='wallets-carousel-loader__title'>
            <Text size='xl' weight='bold'>
                Trader&apos;s Hub
            </Text>
        </div>
        <div className='wallets-carousel-loader__card-container'>
            {Array.from({ length: 3 }).map((_, idx) => (
                <div
                    className='wallets-skeleton wallets-carousel-loader__card'
                    key={`wallets-carousel-loader-card-${idx}`}
                >
                    <div className='wallets-skeleton wallets-carousel-loader__card-body' />
                </div>
            ))}
        </div>
        <div className='wallets-carousel-loader__progress-bar'>
            <div className='wallets-skeleton wallets-carousel-loader__progress-bar__item wallets-carousel-loader__progress-bar__item--active' />
            <div className='wallets-skeleton wallets-carousel-loader__progress-bar__item' />
        </div>
        <div className='wallets-carousel-loader__actions'>
            {Array.from({ length: 3 }).map((_, idx) => (
                <div
                    className='wallets-skeleton wallets-carousel-loader__actions-button'
                    key={`wallets-carousel-loader-action-${idx}`}
                />
            ))}
        </div>
    </div>
);

export default WalletsCarouselLoader;
