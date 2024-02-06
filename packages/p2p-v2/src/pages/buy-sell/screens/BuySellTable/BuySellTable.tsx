import React, { memo } from 'react';
import { Table } from '@/components';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { BuySellRow } from './BuySellRow';
import './BuySellTable.scss';

export type TBuySellRowRenderer = Partial<NonNullable<ReturnType<typeof p2p.advert.useGetList>['data']>[0]>;

const BuySellRowRenderer = memo((values: TBuySellRowRenderer) => <BuySellRow {...values} />);
BuySellRowRenderer.displayName = 'BuySellRowRenderer';

const columns = [
    { header: 'Advertisers' },
    { header: 'Limits' },
    { header: 'Rate (1 USD)' },
    { header: 'Payment methods' },
];

const headerRenderer = (header: string) => <span>{header}</span>;

const BuySellTable = () => {
    const { data, isFetching, isLoading } = p2p.advert.useGetList();

    if (isLoading) return <Loader />;

    return (
        <div className='p2p-v2-buy-sell-table h-full w-full relative'>
            <Table
                columns={columns}
                data={data}
                isFetching={isFetching}
                loadMoreFunction={() => {
                    // TODO: Implement load more
                }}
                renderHeader={headerRenderer}
                rowRender={(data: unknown) => <BuySellRowRenderer {...(data as TBuySellRowRenderer)} />}
                tableClassname=''
            />
        </div>
    );
};

export default BuySellTable;
