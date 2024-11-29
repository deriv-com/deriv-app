import { useEffect, useRef, useState } from 'react';

import { WS } from '@deriv/shared';

export type TradingPlatformStatus = {
    platform: 'mt5' | 'dxtrade' | 'ctrader';
    status: 'active' | 'maintenance' | 'unavailable';
};

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = () => {
    const [data, setData] = useState<TradingPlatformStatus[] | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await WS.send({ trading_platform_status: 1 });
            if (isMounted.current) {
                setData(response.trading_platform_status);
            }
        };

        fetchData();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const getPlatformStatus = (platform: TradingPlatformStatus['platform']) =>
        data?.find(status => status.platform === platform)?.status;

    return { data, getPlatformStatus };
};

export default useTradingPlatformStatus;
