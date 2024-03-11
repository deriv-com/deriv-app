import React from 'react';
import clsx from 'clsx';
import { useDevice } from '@deriv-com/ui';
import { OrdersChat } from '../OrdersChat';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isMobile } = useDevice();
    return (
        <div className={clsx('flex flex-col', isMobile ? 'h-[calc(100vh-12rem)]' : 'h-full')}>
            <OrdersChat />
        </div>
    );
};
export default MyAds;
