import React from 'react';
import { useFetch } from '@deriv/api';
import { TSocketRequestQueryOptions } from '@deriv/api/types';

/**
 * This custom hook returns the advert info for a specific advert by calling 'p2p_advert_info' endpoint
 */
const useP2PAdvertInfo = (id: string, options: TSocketRequestQueryOptions<'p2p_advert_info'>) => {
    const { data, ...rest } = useFetch('p2p_advert_info', { payload: { id }, options });

    const modified_data = React.useMemo(() => {
        const p2p_advert_info = data?.p2p_advert_info;

        if (!p2p_advert_info) return undefined;

        return p2p_advert_info;
    }, [data?.p2p_advert_info]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useP2PAdvertInfo;
