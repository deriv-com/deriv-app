import { useAdvertiserInfo } from '@deriv/api';
import React from 'react';

/**
 *
 * @param advertiserId
 * @param shouldShowLifetime - If set to true, values such as `tradeVolume` will show the total value since registration
 */
const useAdvertiserStats = (advertiserId?: string, shouldShowLifetime?: boolean) => {
    const { data, isSuccess } = useAdvertiserInfo(advertiserId);

    const transformedData = React.useMemo(() => {
        if (!isSuccess) return;

        return {
            /** The percentage of completed orders out of total orders as a buyer within the past 30 days. */
            buyCompletionRate: data?.buy_completion_rate,
            /**  */
            sellCompletionRate: data?.sell_completion_rate,
            /** The average buy time in minutes */
            averagePayTime: data?.buy_time_avg && data.buy_time_avg > 60 ? Math.round(data.buy_time_avg / 60) : 1,
            /** The average release time in minutes */
            averageReleaseTime:
                data?.release_time_avg && data.release_time_avg > 60 ? Math.round(data.release_time_avg / 60) : 1,
            /** The total trade volume since advertiser registration */
            tradeVolume: shouldShowLifetime
                ? data?.total_turnover
                : Number(data?.buy_orders_amount) + Number(data?.sell_orders_amount),
            /** The total number of orders completed since advertiser registration. */
            totalOrders: shouldShowLifetime
                ? data?.total_orders_count
                : Number(data?.buy_orders_count) + Number(data?.sell_orders_count),
            /** Number of different users the advertiser has traded with since registration. */
            tradePartners: data?.partner_count || 0,
            buyOrdersCount: data?.buy_orders_count || 0,
            sellOrdersCount: data?.sell_orders_count || 0,
        };
    }, [data, isSuccess]);

    return {
        data: transformedData,
    };
};

export default useAdvertiserStats;
