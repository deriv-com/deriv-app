import React from 'react';
import BrandSkeleton from './brandSkeleton';
import './headerSkeleton.scss';
import TradershubSkeleton from './tradershubSkeleton';
import MenuSkeleton from './menuSkeleton';
import HeaderRightMenuSkeleton from './headerRightMenuSkeleon';
import VerticalDevider from './devider';

const HeaderSkeleton = () => {
    return (
        <div className='header-skeleton-loader'>
            <div className='header-skeleton-loader__left'>
                <BrandSkeleton />
                <VerticalDevider />
                <TradershubSkeleton />
                <MenuSkeleton />
            </div>
            <div className='header-skeleton-loader__right'>
                <VerticalDevider />
                <HeaderRightMenuSkeleton />
            </div>
        </div>
    );
};

export default HeaderSkeleton;
