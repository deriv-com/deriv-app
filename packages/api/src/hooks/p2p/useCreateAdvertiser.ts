import { useCallback, useMemo } from 'react';
import useMutation from '../../useMutation';
import useInvalidateQuery from '../../useInvalidateQuery';

type TAdvertiseCreatePayload = {
    name: NonNullable<
        Parameters<ReturnType<typeof useMutation<'p2p_advertiser_create'>>['mutate']>
    >[0]['payload']['name'];
};

/** A custom hook that creates a P2P advertiser. This can only be used when the user is authorized.
 *
 * To create an advertiser, specify the following payload arguments in the `mutate` call:
 * @example
 *  mutate({
        name: 'your_name',
    });
 *
*/
const useCreateAdvertiser = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_advertiser_create', {
        onSuccess: () => {
            invalidate('p2p_advertiser_list');
            invalidate('p2p_advertiser_info');
        },
    });

    const mutate = useCallback(
        (payload: TAdvertiseCreatePayload) => {
            _mutate({ payload });
        },
        [_mutate]
    );

    const modified_data = useMemo(() => {
        const advertiser = data?.p2p_advertiser_create;

        if (!advertiser) return undefined;

        const { basic_verification, full_verification, is_approved, is_listed, is_online, show_name, created_time } =
            advertiser;

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
        mutate,
        ...rest,
    };
};

export default useCreateAdvertiser;
