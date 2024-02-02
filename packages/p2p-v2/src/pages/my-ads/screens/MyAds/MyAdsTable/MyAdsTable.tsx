import React, { memo, useMemo } from 'react';
import { p2p } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { Table } from '../../../../../components';
import { MyAdsTableRow } from '../MyAdsTableRow';
import './MyAdsTable.scss';

export type TMyAdsTableRowRendererProps = Partial<
    NonNullable<ReturnType<typeof p2p.advertiserAdverts.useGet>['data']>[0]
> & {
    isBarred: boolean;
    isListed: boolean;
    onClickIcon: (id: string, action: string) => void;
};

const MyAdsTableRowRenderer = memo((values: TMyAdsTableRowRendererProps) => <MyAdsTableRow {...values} />);
MyAdsTableRowRenderer.displayName = 'MyAdsTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

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
                columns={columns}
                data={data}
                headerRender={headerRenderer}
                isFetching={isFetching}
                loadMoreFunction={loadMoreAdverts}
                rowRender={(rowData: unknown) => (
                    <MyAdsTableRowRenderer
                        {...(rowData as TMyAdsTableRowRendererProps)}
                        isBarred={!!advertiserInfo?.blocked_until}
                        isListed={!!advertiserInfo?.is_listed}
                        onClickIcon={onClickIcon}
                    />
                )}
                tableClassname=''
            />
        </div>
    );
};

export default MyAdsTable;
