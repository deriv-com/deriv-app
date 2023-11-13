import { useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook that gets dynamic leverage values. */
const useDynamicLeverage = (platform: 'mt5' | 'dxtrade' | 'ctrader') => {
    const { data, ...rest } = useQuery('trading_platform_leverage', {
        payload: { platform },
    });

    // Add additional information to the dynamic leverage response.
    const modified_data = useMemo(() => {
        if (!data?.trading_platform_leverage) return;

        return { ...data?.trading_platform_leverage };
    }, [data]);

    return {
        data: modified_data?.leverage,
        ...rest,
    };
};

export default useDynamicLeverage;
