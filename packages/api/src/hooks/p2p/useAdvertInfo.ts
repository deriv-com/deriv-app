import { useMemo } from 'react';
import useQuery from '../../useQuery';

/**
 * This custom hook returns the advert info for a specific advert by calling 'p2p_advert_info' endpoint
 */
const useAdvertInfo = (
    id?: string,
    options?: NonNullable<Parameters<typeof useQuery<'p2p_advert_info'>>[1]>['options']
) => {
    const { data, ...rest } = useQuery('p2p_advert_info', { payload: { id }, options });

    const modified_data = useMemo(() => {
        const p2p_advert_info = data?.p2p_advert_info;

        if (!p2p_advert_info) return undefined;

        return {
            ...p2p_advert_info,
            /** Determines whether the advert is a buy advert or not. */
            is_buy: p2p_advert_info?.type === 'buy',
            /** Determines whether the advert is a sell advert or not. */
            is_sell: p2p_advert_info?.type === 'sell',
        };
    }, [data?.p2p_advert_info]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useAdvertInfo;
