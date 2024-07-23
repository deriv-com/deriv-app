import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = () => {
    const { data, ...rest } = useAuthorizedQuery(
        'trading_platform_status',
        {},
        {
            refetchInterval: 120000,
        }
    );

    const tradingPlatformStatusData = data?.trading_platform_status;

    /**
     * Retrieves the status of a specified trading platform.
     * @param platform The platform identifier (e.g., 'ctrader', 'dxtrade', 'mt5').
     * @returns The status of the identified platform ('active', 'maintenance', 'unavailable').
     */
    const getPlatformStatus = (platform: string) => {
        return tradingPlatformStatusData?.find(
            (status: { platform: string; status: string }) => status.platform === platform
        )?.status;
    };

    return {
        ...rest,
        data: tradingPlatformStatusData,
        getPlatformStatus,
    };
};

export default useTradingPlatformStatus;
