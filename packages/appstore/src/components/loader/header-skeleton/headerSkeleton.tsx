import React from 'react';
import BrandSkeleton from '../brand-skeleton/brandSkeleton';
import CashierButtonSkeleton from '../cashier-button-skeleton/cashierButtonSkeleton';
import { VerticalDevider } from '../devider/devider';
import HeaderRightMenuSkeleton from '../header-right-menu-skeleton/headerRightMenuSkeleon';
import MenuSkeleton from '../menu-skeleton/menuSkeleton';
import TradershubMenuSkeleton from '../traders-hub-menu-skeleton/tradershubMenuSkeleton';
import { isMobile } from '@deriv/shared';

import './headerSkeleton.scss';

const HeaderSkeleton = () => {
    return (
        <div className='header-skeleton-loader'>
            <div className='header-skeleton-loader__left'>
                <BrandSkeleton />
                <VerticalDevider />
                <TradershubMenuSkeleton />
                <MenuSkeleton />
            </div>
            <div className='header-skeleton-loader__right'>
                {!isMobile() && <VerticalDevider />}
                <HeaderRightMenuSkeleton />
                <CashierButtonSkeleton />
            </div>
        </div>
    );
};

export default HeaderSkeleton;
