import React from 'react';
import './tradershubSkeleton.scss';

const TradershubSkeleton = () => {
    return (
        <div className='tradershub-skeleton-loader'>
            <div className='skeleton-loader  tradershub-skeleton-loader__icon' />
            <div className='skeleton-loader tradershub-skeleton-loader__title' />
        </div>
    );
};

export default TradershubSkeleton;
