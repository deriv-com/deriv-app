import React, { memo, useEffect, useState } from 'react';
import { Table } from '@/components';
import { MyAdsDeleteModal } from '@/components/Modals';
import { ShareAdsModal } from '@/components/Modals/ShareAdsModal';
import { AD_ACTION } from '@/constants';
import { p2p } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { MyAdsEmpty } from '../../MyAdsEmpty';
import MyAdsTableRowView from '../MyAdsTableRow/MyAdsTableRowView';
import MyAdsDisplayWrapper from './MyAdsDisplayWrapper';
import './MyAdsTable.scss';

export type TMyAdsTableRowRendererProps = Required<
    NonNullable<ReturnType<typeof p2p.advertiserAdverts.useGet>['data']>[0]
> & {
    balanceAvailable: number;
    dailyBuyLimit: string;
    dailySellLimit: string;
    isBarred: boolean;
    isListed: boolean;
    onClickIcon: (id: string, action: string) => void;
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
    const { error, isSuccess, mutate: deleteAd } = p2p.advert.useDelete();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [advertId, setAdvertId] = useState('');
    const [isShareAdsModalOpen, setIsShareAdsModalOpen] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            setAdvertId('');
        }
        if (error?.error?.message) {
            setIsModalOpen(true);
        }
    }, [error?.error?.message, isSuccess]);

    if (isLoading) return <Loader />;

    if (!data.length) return <MyAdsEmpty />;

    const onClickIcon = (id: string, action: string) => {
        //TODO: to implement the onclick actions for share and edit.
        switch (action) {
            case AD_ACTION.ACTIVATE:
                mutate({ id, is_active: 1 });
                break;
            case AD_ACTION.DEACTIVATE:
                mutate({ id, is_active: 0 });
                break;
            case AD_ACTION.DELETE: {
                setAdvertId(id);
                setIsModalOpen(true);
                break;
            }
            case AD_ACTION.SHARE: {
                setAdvertId(id);
                setIsShareAdsModalOpen(true);
                break;
            }
            default:
                break;
        }
    };

    const onClickToggle = () => updateAds({ is_listed: advertiserInfo?.is_listed ? 0 : 1 });

    const onRequestClose = () => {
        if (isModalOpen) {
            setIsModalOpen(false);
        }
    };

    const onClickDelete = () => {
        deleteAd({ id: advertId });
        onRequestClose();
    };

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
                            onClickIcon={onClickIcon}
                        />
                    )}
                    tableClassname=''
                />
            </div>
            {(isModalOpen || error?.error?.message) && (
                <MyAdsDeleteModal
                    error={error?.error?.message}
                    id={advertId}
                    isModalOpen={isModalOpen || !!error?.error?.message}
                    onClickDelete={onClickDelete}
                    onRequestClose={onRequestClose}
                />
            )}
            {isShareAdsModalOpen && (
                <ShareAdsModal
                    id={advertId}
                    isModalOpen={isShareAdsModalOpen}
                    onRequestClose={() => {
                        setIsShareAdsModalOpen(false);
                        setAdvertId('');
                    }}
                />
            )}
        </MyAdsDisplayWrapper>
    );
};

export default MyAdsTable;
