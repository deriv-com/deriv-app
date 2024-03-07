import React, { useState } from 'react';
import { useAdvertiserStats } from '@/hooks';
import { numberToCurrencyText } from '@/utils';
import { useActiveAccount } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import MyProfileStatsItem from './MyProfileStatsItem';
import './MyProfileStats.scss';

type TMyProfileStatsProps = {
    advertiserId?: string;
};

const MyProfileStats = ({ advertiserId }: TMyProfileStatsProps) => {
    const [shouldShowTradeVolumeLifetime, setShouldShowTradeVolumeLifetime] = useState(false);
    const [shouldShowTotalOrdersLifetime, setShouldShowTotalOrdersLifetime] = useState(false);
    const { data, isLoading } = useAdvertiserStats(advertiserId);
    const { data: activeAccount } = useActiveAccount();

    if (isLoading || !data) return <Loader />;

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

    return (
        <div className='p2p-v2-my-profile-stats' data-testid='dt_p2p_v2_profile_stats'>
            <MyProfileStatsItem
                label='Buy completion'
                testId='dt_p2p_v2_profile_stats_buy_completion'
                value={buyCompletionRate ? `${buyCompletionRate}% (${buyOrdersCount})` : '-'}
            />
            <MyProfileStatsItem
                label='Sell completion'
                testId='dt_p2p_v2_profile_stats_sell_completion'
                value={sellCompletionRate ? `${sellCompletionRate}% (${sellOrdersCount})` : '-'}
            />
            <MyProfileStatsItem
                label='Avg pay time'
                testId='dt_p2p_v2_profile_stats_avg_pay_time'
                value={averagePayTime !== -1 ? getTimeValueText(averagePayTime) : '-'}
            />
            <MyProfileStatsItem
                label='Avg release time'
                testId='dt_p2p_v2_profile_stats_avg_release_time'
                value={averageReleaseTime !== -1 ? getTimeValueText(averageReleaseTime) : '-'}
            />
            <MyProfileStatsItem
                currency={activeAccount?.currency || 'USD'}
                label='Trade volume'
                onClickLifetime={hasClickedLifetime => setShouldShowTradeVolumeLifetime(hasClickedLifetime)}
                shouldShowLifetime
                testId='dt_p2p_v2_profile_stats_trade_volume'
                value={
                    shouldShowTradeVolumeLifetime
                        ? numberToCurrencyText(tradeVolumeLifetime)
                        : numberToCurrencyText(tradeVolume)
                }
            />
            <MyProfileStatsItem
                label='Total orders'
                onClickLifetime={hasClickedLifetime => setShouldShowTotalOrdersLifetime(hasClickedLifetime)}
                shouldShowLifetime
                testId='dt_p2p_v2_profile_stats_total_orders'
                value={shouldShowTotalOrdersLifetime ? totalOrdersLifetime.toString() : totalOrders.toString()}
            />
            <MyProfileStatsItem
                label='Trade partners'
                shouldShowDuration={false}
                testId='dt_p2p_v2_profile_stats_trade_partners'
                value={tradePartners.toString()}
            />
        </div>
    );
};

export default MyProfileStats;
