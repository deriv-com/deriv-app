import React from 'react';
import clsx from 'clsx';
import { useDevice } from '@/hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isDesktop, isMobile } = useDevice();
    return (
        <div className={clsx('flex flex-col', { 'h-[calc(100vh-12rem)]': isMobile }, { 'h-full': isDesktop })}>
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
