import { useMemo } from 'react';
import { useAdvertiserInfo } from '@deriv/api';
import { daysSince } from '../utils';

/**
 * Hook to calculate an advertiser's stats based on their information.
 *
 * @param advertiserId - ID of the advertiser stats to reveal. If not provided, by default it will return the user's own stats.
 */
const useAdvertiserStats = (advertiserId?: string) => {
    const { data, isSuccess, ...rest } = useAdvertiserInfo(advertiserId);

    const transformedData = useMemo(() => {
        if (!isSuccess) return;

        return {
            ...data,

            /** The average buy time in minutes */
            averagePayTime: data?.buy_time_avg && data.buy_time_avg > 60 ? Math.round(data.buy_time_avg / 60) : 1,

            /** The average release time in minutes */
            averageReleaseTime:
                data?.release_time_avg && data.release_time_avg > 60 ? Math.round(data.release_time_avg / 60) : 1,

            /** The percentage of completed orders out of total orders as a buyer within the past 30 days. */
            buyCompletionRate: data?.buy_completion_rate || 0,

            /** The number of buy order completed within the past 30 days. */
            buyOrdersCount: Number(data?.buy_orders_count) || 0,

            /** The daily available balance buy limit for P2P transactions in the past 24 hours. */
            dailyAvailableBuyLimit: Number(data?.daily_buy_limit) - Number(data?.daily_buy) || 0,

            /** The daily available balance sell limit for P2P transactions in the past 24 hours. */
            dailyAvailableSellLimit: Number(data?.daily_sell_limit) - Number(data?.daily_sell) || 0,

            /** The number of days since the user has became an advertiser */
            daysSinceJoined: daysSince(data?.created_time ? data.created_time.toISOString().split('T')[0] : ''),

            /** The percentage of completed orders out of total orders as a seller within the past 30 days. */
            sellCompletionRate: data?.sell_completion_rate || 0,

            /** The number of sell order orders completed within the past 30 days. */
            sellOrdersCount: Number(data?.sell_orders_count) || 0,

            /** The total number of orders completed within the past 30 days*/
            totalOrders: Number(data?.buy_orders_count) + Number(data?.sell_orders_count) || 0,

            /** The total number of orders completed since registration */
            totalOrdersLifetime: Number(data?.total_orders_count) || 0,

            /** Number of different users the advertiser has traded with since registration. */
            tradePartners: Number(data?.partner_count) || 0,

            /** The total trade volume within the past 30 days */
            tradeVolume: Number(data?.buy_orders_amount) + Number(data?.sell_orders_amount) || 0,

            /** The total trade volume since registration */
            tradeVolumeLifetime: Number(data?.total_turnover) || 0,
        };
    }, [data, isSuccess]);

    return {
        data: transformedData,
        isSuccess,
        ...rest,
    };
};

export default useAdvertiserStats;
