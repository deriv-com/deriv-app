import React, { memo, useMemo } from 'react';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { Table } from '../../../../components';
import MyAdsTableRow from './MyAdsTableRow';
import './MyAdsTable.scss';

export type TMyAdsTableRowRendererProps = Partial<
    NonNullable<ReturnType<typeof p2p.advertiserAdverts.useGet>['data']>[0]
> & {
    onClickIcon: (id: string, action: string) => void;
    isBarred: boolean;
    isListed: boolean;
};

const MyAdsTableRowRenderer = memo((values: TMyAdsTableRowRendererProps) => <MyAdsTableRow {...values} />);

const headerRenderer = (header: any) => <div>{header}</div>;

const MyAdsTable = () => {
    const columns = useMemo(
        () => [
            {
                header: 'Ad ID',
            },
            {
                header: 'Limits',
            },
            {
                header: 'Rate (1 BTC)',
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
        ],
        []
    );

    const { data = [], isFetching, isLoading, loadMoreAdverts } = p2p.advertiserAdverts.useGet();
    const { data: advertiserInfo } = p2p.advertiser.useGetInfo();
    const { mutate } = p2p.advert.useUpdate();

    if (isLoading) return <Loader />;

    const onClickIcon = (id: string, action: string) => {
        //TODO: to implement the onclick actions
        switch (action) {
            case 'activate':
                mutate({ id, is_active: 1 });
                break;
            case 'deactivate':
                mutate({ id, is_active: 0 });
                break;
            case 'edit':
                break;
            default:
                break;
        }
    };

    return (
        <div className='p2p-v2-my-ads-table'>
            <Table
                data={data}
                isFetching={isFetching}
                loadMoreFunction={loadMoreAdverts}
                rowClassname=''
                tableClassname=''
                rowRender={(rowData: unknown) => (
                    <MyAdsTableRowRenderer {...(rowData as TMyAdsTableRowRendererProps)} onClickIcon={onClickIcon} isBarred={!!advertiserInfo?.blocked_until} isListed={!!advertiserInfo?.is_listed} />
                )}
                columns={columns}
                headerRender={headerRenderer}
            />
        </div>
    );
};

export default MyAdsTable;
