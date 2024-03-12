import React, { useState } from 'react';
import { ADVERT_TYPE, BUY_SELL } from '@/constants';
import { p2p } from '@deriv/api-v2';
import { Tab, Tabs } from '@deriv-com/ui';
import { AdvertsTableRenderer } from './AdvertsTableRenderer';
import './AdvertiserAdvertsTable.scss';

type TAdvertiserAdvertsTableProps = {
    advertiserId: string;
};

const AdvertiserAdvertsTable = ({ advertiserId }: TAdvertiserAdvertsTableProps) => {
    const [activeTab, setActiveTab] = useState<'Buy' | 'Sell'>('Buy');
    const { data, isFetching, isLoading, loadMoreAdverts } = p2p.advert.useGetList({
        advertiser_id: advertiserId,
        counterparty_type: activeTab === 'Buy' ? BUY_SELL.BUY : BUY_SELL.SELL,
    });

    return (
        <div className='p2p-v2-advertiser-adverts-table'>
            <Tabs
                activeTab={activeTab}
                className='lg:w-80 lg:mt-10'
                onChange={(index: number) => setActiveTab(index === 0 ? ADVERT_TYPE.BUY : ADVERT_TYPE.SELL)}
                variant='secondary'
            >
                <Tab className='text-xs' title='Buy' />
                <Tab title='Sell' />
            </Tabs>
            <AdvertsTableRenderer
                data={data}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreAdverts={loadMoreAdverts}
            />
        </div>
    );
};

export default AdvertiserAdvertsTable;
