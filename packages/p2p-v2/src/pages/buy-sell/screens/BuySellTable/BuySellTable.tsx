import React, { memo, useState } from 'react';
import { Table } from '@/components';
import { BUY_SELL } from '@/constants';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { BuySellHeader } from '../BuySellHeader';
import { BuySellTableRow } from './BuySellTableRow';
import './BuySellTable.scss';

export type TBuySellTableRowRenderer = Partial<NonNullable<ReturnType<typeof p2p.advert.useGetList>['data']>[0]>;

const BuySellRowRenderer = memo((values: TBuySellTableRowRenderer) => <BuySellTableRow {...values} />);
BuySellRowRenderer.displayName = 'BuySellRowRenderer';

const columns = [
    { header: 'Advertisers' },
    { header: 'Limits' },
    { header: 'Rate (1 USD)' },
    { header: 'Payment methods' },
];

const headerRenderer = (header: string) => <span>{header}</span>;

const BuySellTable = () => {
    const [activeTab, setActiveTab] = useState<string>('Buy');
    const { data, isFetching, isLoading, loadMoreAdverts } = p2p.advert.useGetList({
        counterparty_type: activeTab === 'Buy' ? BUY_SELL.BUY : BUY_SELL.SELL,
    });

    return (
        <div className='p2p-v2-buy-sell-table h-full w-full relative flex flex-col'>
            <BuySellHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {isLoading ? (
                <Loader className='mt-80' />
            ) : (
                // TODO: Add empty state
                <Table
                    columns={columns}
                    data={data}
                    isFetching={isFetching}
                    loadMoreFunction={loadMoreAdverts}
                    renderHeader={headerRenderer}
                    rowRender={(data: unknown) => <BuySellRowRenderer {...(data as TBuySellTableRowRenderer)} />}
                    tableClassname=''
                />
            )}
        </div>
    );
};

export default BuySellTable;
