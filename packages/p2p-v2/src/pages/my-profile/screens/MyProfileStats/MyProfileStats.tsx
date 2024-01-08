import React, { useState } from 'react';
import { useActiveAccount } from '@deriv/api';
import { useAdvertiserStats } from '../../../../hooks';
import MyProfileStatsItem from './MyProfileStatsItem';
import './MyProfileStats.scss';

type MyProfileStatsProps = {
    advertiserId?: string;
};

export const MyProfileStats = ({ advertiserId }: MyProfileStatsProps) => {
    const [shouldShowTradeVolumeLifetime, setShouldShowTradeVolumeLifetime] = useState(false);
    const [shouldShowTotalOrdersLifetime, setShouldShowTotalOrdersLifetime] = useState(false);
    const { data } = useAdvertiserStats(advertiserId);
    const { data: activeAccountData } = useActiveAccount();

    if (!data || !activeAccountData) return <h1>Loading...</h1>;

    // NOTE: This component is only visible for accounts with USD currency
    if (activeAccountData?.currency !== 'USD') return <></>;

    const {
        averagePayTime,
        averageReleaseTime,
        buyCompletionRate,
        buyOrdersCount,
        sellCompletionRate,
        sellOrdersCount,
        totalOrders,
        totalOrdersLifetime,
        tradePartners,
        tradeVolume,
        tradeVolumeLifetime,
    } = data;

    const getTimeValueText = (minutes: number) => `${minutes === 1 ? '< ' : ''}${minutes} min`;
    const getCurrencyText = (currency: number) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'decimal' }).format(
            currency
        );

    return (
        <div className='p2p-v2-my-profile-stats'>
            <MyProfileStatsItem
                label='Buy completion'
                value={buyCompletionRate ? `${buyCompletionRate}% (${buyOrdersCount})` : '-'}
            />
            <MyProfileStatsItem
                label='Sell completion'
                value={sellCompletionRate ? `${sellCompletionRate}% (${sellOrdersCount})` : '-'}
            />
            <MyProfileStatsItem label='Avg pay time' value={getTimeValueText(averagePayTime)} />
            <MyProfileStatsItem
                label='Avg release time'
                value={averageReleaseTime ? getTimeValueText(averageReleaseTime) : '-'}
            />
            <MyProfileStatsItem
                currency='USD'
                label='Trade volume'
                onClickLifetime={hasClickedLifetime => setShouldShowTradeVolumeLifetime(hasClickedLifetime)}
                shouldShowLifetime
                value={
                    shouldShowTradeVolumeLifetime ? getCurrencyText(tradeVolumeLifetime) : getCurrencyText(tradeVolume)
                }
            />
            <MyProfileStatsItem
                label='Total orders'
                onClickLifetime={hasClickedLifetime => setShouldShowTotalOrdersLifetime(hasClickedLifetime)}
                shouldShowLifetime
                value={shouldShowTotalOrdersLifetime ? totalOrdersLifetime.toString() : totalOrders.toString()}
            />
            <MyProfileStatsItem label='Trade partners' shouldShowDuration={false} value={tradePartners?.toString()} />
        </div>
    );
};
