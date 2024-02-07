import React from 'react';
import './brandSkeleton.scss';

export const brandSkeleton = () => {
    return (
        <div className='brand-skeleton-loader'>
            <div className='skeleton-loader brand-skeleton-loader__brand' />
        </div>
    );
};

export default brandSkeleton;
