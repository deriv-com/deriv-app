import { useMemo } from 'react';
import { daysSince } from '@/utils';
import { p2p, useAuthentication, useSettings } from '@deriv/api-v2';

/**
 * Formats the advertiser duration into the following format:
 * -1 if duration is not provided, in this case "-" would be displayed in the advertiser stats
 * otherwise, converts the duration to minutes, and
 * 1 if the duration is less than 60 seconds
 */
const toAdvertiserMinutes = (duration?: number | null) => {
    if (!duration) return -1;
    if (duration > 60) return Math.round(duration / 60);
    return 1;
};

/**
 * Hook to calculate an advertiser's stats based on their information.
 *
 * @param advertiserId - ID of the advertiser stats to reveal. If not provided, by default it will return the user's own stats.
 */
const useAdvertiserStats = (advertiserId?: string) => {
    const { data, isSuccess, ...rest } = p2p.advertiser.useGetInfo(advertiserId);
    const { data: settings, isSuccess: isSuccessSettings } = useSettings();
    const { data: authenticationStatus, isSuccess: isSuccessAuthenticationStatus } = useAuthentication();

    const transformedData = useMemo(() => {
        if (!isSuccess && !isSuccessSettings && !isSuccessAuthenticationStatus) return;

        const isAdvertiser = data?.is_approved;

        return {
            ...data,

            /** The average buy time in minutes */
            averagePayTime: toAdvertiserMinutes(data?.buy_time_avg),

            /** The average release time in minutes */
            averageReleaseTime: toAdvertiserMinutes(data?.release_time_avg),

            /** The percentage of completed orders out of total orders as a buyer within the past 30 days. */
            buyCompletionRate: data?.buy_completion_rate || 0,

            /** The number of buy order completed within the past 30 days. */
            buyOrdersCount: Number(data?.buy_orders_count) || 0,

            /** The daily available balance buy limit for P2P transactions in the past 24 hours. */
            dailyAvailableBuyLimit: Number(data?.daily_buy_limit) - Number(data?.daily_buy) || 0,

            /** The daily available balance sell limit for P2P transactions in the past 24 hours. */
            dailyAvailableSellLimit: Number(data?.daily_sell_limit) - Number(data?.daily_sell) || 0,

            /** The number of days since the user has became an advertiser */
            daysSinceJoined: daysSince(
                data?.created_time ? new Date(data.created_time * 1000).toISOString().split('T')[0] : ''
            ),

            /** The advertiser's full name */
            fullName: `${settings?.first_name || ''} ${settings?.last_name || ''}`,

            /** Checks if the advertiser has completed proof of address verification */
            isAddressVerified: isAdvertiser
                ? data?.full_verification
                : authenticationStatus?.document?.status === 'verified',

            /** Checks if the user is already an advertiser */
            isAdvertiser,

            /** Checks if the user is eligible to upgrade their daily limits */
            isEligibleForLimitUpgrade: Boolean(data?.upgradable_daily_limits),

            /** Checks if the advertiser has completed proof of identity verification */
            isIdentityVerified: isAdvertiser
                ? data?.basic_verification
                : authenticationStatus?.identity?.status === 'verified',

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
    }, [data, settings, isSuccess, isSuccessSettings, isSuccessAuthenticationStatus, authenticationStatus]);

    return {
        data: transformedData,
        isSuccess,
        ...rest,
    };
};

export default useAdvertiserStats;
