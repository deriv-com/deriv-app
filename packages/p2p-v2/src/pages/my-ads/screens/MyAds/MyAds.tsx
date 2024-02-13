import React from 'react';
import clsx from 'clsx';
import { useDevice } from '@/hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isMobile } = useDevice();
    return (
        <div className={clsx('flex flex-col h-full', { 'h-[calc(100vh-12rem)]': isMobile })}>
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
