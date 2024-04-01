import React from 'react';
import clsx from 'clsx';
import { useQueryString } from '@/hooks';
import { useDevice } from '@deriv-com/ui';
import { CreateEditAd } from '../CreateEditAd';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isMobile } = useDevice();
    const { queryString } = useQueryString();
    if (queryString.formAction) {
        return <CreateEditAd />;
    }

    return (
        <div className={clsx('flex flex-col', isMobile ? 'h-[calc(100vh-12rem)]' : 'h-full')}>
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
