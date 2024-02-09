import React, { memo, useState } from 'react';
import { Table } from '@/components';
import MyAdsDeleteModal from '@/components/Modals/MyAdsDeleteModal/MyAdsDeleteModal';
import { useDevice } from '@/hooks';
import { p2p } from '@deriv/api';
import { Button, Loader } from '@deriv-com/ui';
import { MyAdsTableRow } from '../MyAdsTableRow';
import { MyAdsToggle } from '../MyAdsToggle';
import './MyAdsTable.scss';

export type TMyAdsTableRowRendererProps = Required<
    NonNullable<ReturnType<typeof p2p.advertiserAdverts.useGet>['data']>[0]
> & {
    isBarred: boolean;
    isListed: boolean;
    onClickIcon: (id: string, action: string) => void;
};

const MyAdsTableRowRenderer = memo((values: TMyAdsTableRowRendererProps) => <MyAdsTableRow {...values} />);
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
];

const MyAdsTable = () => {
    const { data = [], isFetching, isLoading, loadMoreAdverts } = p2p.advertiserAdverts.useGet();
    const { data: advertiserInfo } = p2p.advertiser.useGetInfo();
    const { mutate } = p2p.advert.useUpdate();
    const { mutate: updateAds } = p2p.advertiser.useUpdate();
    const { error, mutate: deleteAd } = p2p.advert.useDelete();
    const { isDesktop } = useDevice();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [advertId, setAdvertId] = useState('');

    if (isLoading) return <Loader />;

    const onClickIcon = (id: string, action: string) => {
        //TODO: to implement the onclick actions for share and edit.
        switch (action) {
            case 'activate':
                mutate({ id, is_active: 1 });
                break;
            case 'deactivate':
                mutate({ id, is_active: 0 });
                break;
            case 'delete': {
                setAdvertId(id);
                setIsModalOpen(true);
                break;
            }
            default:
                break;
        }
    };

    const onClickToggle = () => updateAds({ is_listed: advertiserInfo?.is_listed ? 0 : 1 });

    const onRequestClose = () => {
        setAdvertId('');
        if (isModalOpen) {
            setIsModalOpen(false);
        }
    };

    const onClickDelete = () => {
        deleteAd({ id: advertId });
        onRequestClose();
    };

    return (
        <>
            <div className='p2p-v2-my-ads-table__header'>
                {isDesktop && (
                    <Button size='lg' textSize='sm'>
                        Create new ad
                    </Button>
                )}
                <MyAdsToggle
                    isPaused={!!advertiserInfo?.blocked_until || !advertiserInfo?.is_listed}
                    onClickToggle={onClickToggle}
                />
            </div>
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
                            isBarred={!!advertiserInfo?.blocked_until}
                            isListed={!!advertiserInfo?.is_listed}
                            onClickIcon={onClickIcon}
                        />
                    )}
                    tableClassname=''
                />
            </div>
            {(isModalOpen || error?.error?.message) && (
                <MyAdsDeleteModal
                    error={error}
                    id={advertId}
                    isModalOpen={isModalOpen || !!error?.error?.message}
                    onClickDelete={onClickDelete}
                    onRequestClose={onRequestClose}
                />
            )}
        </>
    );
};

export default MyAdsTable;
