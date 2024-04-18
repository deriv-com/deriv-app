import React, { memo } from 'react';
import { THooks } from 'types';
import { Table } from '@/components';
import { p2p } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { MyAdsEmpty } from '../../MyAdsEmpty';
import MyAdsTableRowView from '../MyAdsTableRow/MyAdsTableRowView';
import MyAdsDisplayWrapper from './MyAdsDisplayWrapper';
import './MyAdsTable.scss';

export type TMyAdsTableRowRendererProps = Required<THooks.AdvertiserAdverts.Get>[0] & {
    balanceAvailable: number;
    dailyBuyLimit: string;
    dailySellLimit: string;
    isBarred: boolean;
    isListed: boolean;
};

const MyAdsTableRowRenderer = memo((values: TMyAdsTableRowRendererProps) => <MyAdsTableRowView {...values} />);
MyAdsTableRowRenderer.displayName = 'MyAdsTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

const columns = [
    {
        header: 'Ad ID',
    },
    {
        header: 'Limits',
    },
    {
        header: 'Rate (1 USD)',
    },
    {
        header: 'Available amount',
    },
    {
        header: 'Payment methods',
    },
    {
        header: 'Status',
    },
];

const MyAdsTable = () => {
    const { data = [], isFetching, isLoading, loadMoreAdverts } = p2p.advertiserAdverts.useGet();
    const { data: advertiserInfo } = p2p.advertiser.useGetInfo();
    const { mutate: updateAds } = p2p.advertiser.useUpdate();

    if (isLoading) return <Loader />;

    if (!data.length) return <MyAdsEmpty />;

    const onClickToggle = () => updateAds({ is_listed: advertiserInfo?.is_listed ? 0 : 1 });

    return (
        <MyAdsDisplayWrapper
            isPaused={!!advertiserInfo?.blocked_until || !advertiserInfo?.is_listed}
            onClickToggle={onClickToggle}
        >
            <div className='p2p-v2-my-ads-table__list'>
                <Table
                    columns={columns}
                    data={data}
                    isFetching={isFetching}
                    loadMoreFunction={loadMoreAdverts}
                    renderHeader={headerRenderer}
                    rowRender={(rowData: unknown) => (
                        <MyAdsTableRowRenderer
                            {...(rowData as TMyAdsTableRowRendererProps)}
                            balanceAvailable={advertiserInfo?.balance_available ?? 0}
                            dailyBuyLimit={advertiserInfo?.daily_buy_limit ?? ''}
                            dailySellLimit={advertiserInfo?.daily_sell_limit ?? ''}
                            isBarred={!!advertiserInfo?.blocked_until}
                            isListed={!!advertiserInfo?.is_listed}
                        />
                    )}
                    tableClassname=''
                />
            </div>
        </MyAdsDisplayWrapper>
    );
};

export default MyAdsTable;
