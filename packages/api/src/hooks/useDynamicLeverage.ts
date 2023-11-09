import useQuery from '../useQuery';

/** A custom hook that gets dynamic leverage values. */
const useDynamicLeverage = (platform: 'mt5' | 'dxtrade' | 'ctrader') => {
    const { data: dynamic_leverages, ...rest } = useQuery('trading_platform_leverage', {
        payload: { platform },
    });

    return {
        data: dynamic_leverages?.trading_platform_leverage.leverage,
        ...rest,
    };
};

export default useDynamicLeverage;
