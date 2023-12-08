import React, { useCallback, useMemo } from 'react';
import useAuthorize from './useAuthorize';
import useMutation from '../useMutation';

type TAdvertiseCreatePayload = {
    name: string;
};

const useCreateAdvertiser = () => {
    const { isSuccess: isUserAuthorized } = useAuthorize();
    const { data, mutate, ...rest } = useMutation('p2p_advertiser_create');

    const createAdvertiser = useCallback(
        (payload: TAdvertiseCreatePayload) => {
            if (isUserAuthorized) mutate({ payload });
        },
        [isUserAuthorized, mutate]
    );

    const modified_data = useMemo(() => {
        if (!data?.p2p_advertiser_create) return undefined;

        return { ...data?.p2p_advertiser_create };
    }, [data]);

    return {
        isUserAuthorized,
        data,
        createAdvertiser,
        ...rest,
    };
};

export default useCreateAdvertiser;
