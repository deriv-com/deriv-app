import React, { memo } from 'react';
import { THooks } from 'types';
import { Table } from '@/components';
import { useIsAdvertiser } from '@/hooks';
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
    const isAdvertiser = useIsAdvertiser();
    const {
        data = [],
        isFetching,
        isLoading,
        loadMoreAdverts,
    } = p2p.advertiserAdverts.useGet(undefined, {
        enabled: isAdvertiser,
    });
    const { data: advertiserInfo } = p2p.advertiser.useGetInfo();
    const {
        balance_available: balanceAvailable,
        blocked_until: blockedUntil,
        daily_buy_limit: dailyBuyLimit,
        daily_sell_limit: dailySellLimit,
        is_listed_boolean: isListed,
    } = advertiserInfo || {};
    const { mutate: updateAds } = p2p.advertiser.useUpdate();

    if (isLoading && isFetching) return <Loader />;

    if (!data.length) return <MyAdsEmpty />;

    const onClickToggle = () => updateAds({ is_listed: isListed ? 0 : 1 });

    return (
        <MyAdsDisplayWrapper isPaused={!!blockedUntil || !isListed} onClickToggle={onClickToggle}>
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
                            balanceAvailable={balanceAvailable ?? 0}
                            dailyBuyLimit={dailyBuyLimit ?? ''}
                            dailySellLimit={dailySellLimit ?? ''}
                            isBarred={!!blockedUntil}
                            isListed={!!isListed}
                        />
                    )}
                    tableClassname=''
                />
            </div>
        </MyAdsDisplayWrapper>
    );
};

export default MyAdsTable;
