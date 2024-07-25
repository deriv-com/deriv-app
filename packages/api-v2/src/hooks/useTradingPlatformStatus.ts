import { CFD_PLATFORMS, TRADING_PLATFORM_STATUS } from '@deriv/shared';
import useAuthorizedQuery from '../useAuthorizedQuery';
import useQuery from '../useQuery';

type TPlatformStatus = Exclude<
    NonNullable<ReturnType<typeof useQuery<'trading_platform_status'>>['data']>['trading_platform_status'][0],
    undefined
>;

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
        const platformStatus =
            platform === CFD_PLATFORMS.MT5 || platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER
                ? tradingPlatformStatusData?.find((status: TPlatformStatus) => status.platform === platform)?.status
                : TRADING_PLATFORM_STATUS.ACTIVE; // fallback status as cashier may return non-cfd platform (i.e. doughflow, p2p, paymentagent, etc)

        return platformStatus;
    };

    return {
        ...rest,
        data: tradingPlatformStatusData,
        getPlatformStatus,
    };
};

export default useTradingPlatformStatus;
