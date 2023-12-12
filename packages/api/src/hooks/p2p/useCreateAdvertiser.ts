import React, { useCallback, useMemo } from 'react';
import useAuthorize from '../useAuthorize';
import useMutation from '../../useMutation';
import useInvalidateQuery from '../../useInvalidateQuery';

type TAdvertiseCreatePayload = {
 name: NonNullable<
        Parameters<ReturnType<typeof useMutation<'p2p_advertiser_create'>>['mutate']>
    >[0]['payload']['name'];
};

const useCreateAdvertiser = () => {
    const invalidate = useInvalidateQuery();
    const { isSuccess: isUserAuthorized } = useAuthorize();
    const { data, mutate, ...rest } = useMutation('p2p_advertiser_create', {
        onSuccess: () => {
            invalidate('p2p_advertiser_list');
            invalidate('p2p_advertiser_info');
        },
    });

    const createAdvertiser = useCallback(
        (payload: TAdvertiseCreatePayload) => {
            if (isUserAuthorized) mutate({ payload });
        },
        [isUserAuthorized, mutate]
    );

    const modified_data = useMemo(() => {
        if (!data?.p2p_advertiser_create) return undefined;

        const { basic_verification, full_verification, is_approved, is_listed, is_online, show_name, created_time } =
            data?.p2p_advertiser_info;

        return {
            ...data?.p2p_advertiser_create,
            /** Indicating whether the advertiser's identify has been verified. */
            basic_verification: Boolean(basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            full_verification: Boolean(full_verification),
            /** The approval status of the advertiser. */
            is_approved: Boolean(is_approved),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(is_online),
            /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
            show_name: Boolean(show_name),
            /** The epoch time that the client became an advertiser. */
            created_time: new Date(created_time),
        };
    }, [data]);

    return {
        data: modified_data,
        createAdvertiser,
        ...rest,
    };
};

export default useCreateAdvertiser;
