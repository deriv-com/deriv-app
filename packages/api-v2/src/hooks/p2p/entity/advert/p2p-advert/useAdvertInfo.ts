import { useMemo } from 'react';
import useQuery from '../../../../../useQuery';

/**
 * This custom hook returns the advert information about the given advert ID.
 */
const useAdvertInfo = (
    payload: NonNullable<Parameters<typeof useQuery<'p2p_advert_info'>>[1]>['payload'],
    options?: NonNullable<Parameters<typeof useQuery<'p2p_advert_info'>>[1]>['options']
) => {
    const { data, ...rest } = useQuery('p2p_advert_info', {
        payload,
        options,
    });

    const modified_data = useMemo(() => {
        const p2p_advert_info = data?.p2p_advert_info;

        if (!p2p_advert_info) return undefined;

        return {
            ...p2p_advert_info,
            /** Determines whether the advert is a buy advert or not. */
            is_buy: p2p_advert_info.type === 'buy',
            /** Determines whether the advert is a sell advert or not. */
            is_sell: p2p_advert_info.type === 'sell',
            is_block_trade: Boolean(p2p_advert_info.block_trade),
            is_deleted: Boolean(p2p_advert_info.deleted),
            is_active: Boolean(p2p_advert_info.is_active),
            is_visible: Boolean(p2p_advert_info.is_visible),
            /**
             * @deprecated This property was deprecated on back-end
             * @see https://api.deriv.com/api-explorer#p2p_advert_info
             * **/
            payment_method: p2p_advert_info.payment_method,
        };
    }, [data?.p2p_advert_info]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useAdvertInfo;
