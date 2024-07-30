import { useState, useEffect } from 'react';
import { TPlatform, WS } from '@deriv/shared';

type TradingPlatformStatus = {
    platform: TPlatform;
    status: 'active' | 'maintenance' | 'unavailable';
};

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = () => {
    const [data, setData] = useState<TradingPlatformStatus[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await WS.send({ trading_platform_status: 1 });
            setData(response.trading_platform_status);
        };

        fetchData();
    }, []);

    const getPlatformStatus = (platform: TradingPlatformStatus['platform']) =>
        data?.find(status => status.platform === platform)?.status;

    return { data, getPlatformStatus };
};

export default useTradingPlatformStatus;
