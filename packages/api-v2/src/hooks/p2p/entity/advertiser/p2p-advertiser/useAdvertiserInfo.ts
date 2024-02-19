import { useMemo } from 'react';
import useQuery from '../../../../../useQuery';
import useAuthorize from '../../../../useAuthorize';

/** This custom hook returns information about the given advertiser ID */
const useAdvertiserInfo = (id?: string) => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_advertiser_info', { payload: { id }, options: { enabled: isSuccess } });

    // Add additional information to the p2p_advertiser_info data
    const modified_data = useMemo(() => {
        const advertiser_info = data?.p2p_advertiser_info;

        if (!advertiser_info) return undefined;

        const {
            basic_verification,
            full_verification,
            is_approved,
            is_blocked,
            is_favourite,
            is_listed,
            is_online,
            show_name,
        } = advertiser_info;

        return {
            ...advertiser_info,
            /** Indicating whether the advertiser's identify has been verified. */
            basic_verification: Boolean(basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            full_verification: Boolean(full_verification),
            /** The approval status of the advertiser. */
            is_approved: Boolean(is_approved),
            /** Indicates that the advertiser is blocked by the current user. */
            is_blocked: Boolean(is_blocked),
            /** Indicates that the advertiser is a favourite of the current user. */
            is_favourite: Boolean(is_favourite),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(is_online),
            /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
            show_name: Boolean(show_name),
        };
    }, [data?.p2p_advertiser_info]);

    return {
        /** P2P advertiser information */
        data: modified_data,
        ...rest,
    };
};

export default useAdvertiserInfo;
