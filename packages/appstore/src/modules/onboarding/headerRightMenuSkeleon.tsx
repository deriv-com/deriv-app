import React from 'react';
import './headerRightMenuSkeleton.scss';

const HeaderRightMenuSkeleton = () => {
    return (
        <div className='header-right-menu-skeleton-loader'>
            <div className='skeleton-loader  header-right-menu-skeleton-loader__icon' />
            <div className='skeleton-loader  header-right-menu-skeleton-loader__icon' />
            <div className='skeleton-loader  header-right-menu-skeleton-loader__icon' />
        </div>
    );
};

export default HeaderRightMenuSkeleton;
