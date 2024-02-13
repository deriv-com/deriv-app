import React, { memo, PropsWithChildren } from 'react';
import { FullPageMobileWrapper, Table } from '@/components';
import { useDevice } from '@/hooks';
import { p2p } from '@deriv/api';
import { Button, Loader } from '@deriv-com/ui';
import { MyAdsEmpty } from '../../MyAdsEmpty';
import MyAdsTableRowView from '../MyAdsTableRow/MyAdsTableRowView';
import { MyAdsToggle } from '../MyAdsToggle';
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

type TMyAdsDisplayWrapperProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};

const MyAdsDisplayWrapper = ({ children, isPaused, onClickToggle }: PropsWithChildren<TMyAdsDisplayWrapperProps>) => {
    const { isMobile } = useDevice();
    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => (
                    <Button isFullWidth size='lg' textSize='md'>
                        Create new ad
                    </Button>
                )}
                renderHeader={() => <MyAdsToggle isPaused={isPaused} onClickToggle={onClickToggle} />}
                shouldShowBackIcon={false}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <>
            <div className='flex items-center justify-between my-[1.6rem]'>
                <Button size='lg' textSize='sm'>
                    Create new ad
                </Button>
                <MyAdsToggle isPaused={isPaused} onClickToggle={onClickToggle} />
            </div>
            {children}
        </>
    );
};

const MyAdsTable = () => {
    const { data = [], isFetching, isLoading, loadMoreAdverts } = p2p.advertiserAdverts.useGet();
    const { data: advertiserInfo } = p2p.advertiser.useGetInfo();
    const { mutate } = p2p.advert.useUpdate();
    const { mutate: updateAds } = p2p.advertiser.useUpdate();

    if (isLoading) return <Loader />;

    if (!data.length) return <MyAdsEmpty />;

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
            default:
                break;
        }
    };

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
                            onClickIcon={onClickIcon}
                        />
                    )}
                    tableClassname=''
                />
            </div>
        </MyAdsDisplayWrapper>
    );
};

export default MyAdsTable;
