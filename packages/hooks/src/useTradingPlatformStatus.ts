import { WS } from '@deriv/shared';

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = async () => {
    const tradingPlatformStatus = await WS.send({ trading_platform_status: 1 });

    return { tradingPlatformStatus };
};

export default useTradingPlatformStatus;
