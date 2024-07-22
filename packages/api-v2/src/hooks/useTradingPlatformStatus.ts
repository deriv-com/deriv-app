import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = () => {
    const { data: trading_platform_status, ...rest } = useAuthorizedQuery(
        'trading_platform_status',
        {},
        {
            refetchInterval: 120000,
        }
    );

    return {
        /** List of cfd platform statuses */
        data: trading_platform_status?.trading_platform_status,
        ...rest,
    };
};

export default useTradingPlatformStatus;
