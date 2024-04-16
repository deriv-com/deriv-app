import { useCallback, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useSubscription from '../../../../../useSubscription';
import { TSocketRequestPayload, TSocketResponseData } from '../../../../../../types';

type TP2PAdvertiserInfo = TSocketResponseData<'p2p_advertiser_info'>['p2p_advertiser_info'] & {
    has_basic_verification: boolean;
    has_full_verification: boolean;
    is_approved_boolean: boolean;
    is_blocked_boolean: boolean;
    is_favourite_boolean: boolean;
    is_listed_boolean: boolean;
    is_online_boolean: boolean;
    should_show_name: boolean;
};

type TPayload = NonNullable<TSocketRequestPayload<'p2p_advertiser_info'>> & { id: string };

/** This custom hook returns information about the given advertiser ID */
const useAdvertiserInfo = (id?: string) => {
    const { data, subscribe: subscribeAdvertiserInfo, ...rest } = useSubscription('p2p_advertiser_info');

    /**
     * Use different local storage key for each advertiser, one to keep the current user's info, the other to keep the advertiser's info
     * This is to prevent the current user's info from being overwritten by the advertiser's info when the current user views the advertiser's profile.
     *
     * Key removal is handled in useAdvertiserStats hook's useEffect.
     * */
    const local_storage_key = id ? `p2p_v2_p2p_advertiser_info_${id}` : 'p2p_v2_p2p_advertiser_info';
    const [p2p_advertiser_info, setP2PAdvertiserInfo] = useLocalStorage<DeepPartial<TP2PAdvertiserInfo>>(
        local_storage_key,
        {}
    );

    const subscribe = useCallback(
        (payload?: TPayload) => {
            subscribeAdvertiserInfo({ payload });
        },
        [subscribeAdvertiserInfo]
    );

    // Add additional information to the p2p_advertiser_info data
    useEffect(() => {
        if (data) {
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

            setP2PAdvertiserInfo({
                ...advertiser_info,
                /** Indicating whether the advertiser's identify has been verified. */
                has_basic_verification: Boolean(basic_verification),
                /** Indicating whether the advertiser's address has been verified. */
                has_full_verification: Boolean(full_verification),
                /** The approval status of the advertiser. */
                is_approved_boolean: Boolean(is_approved),
                /** Indicates that the advertiser is blocked by the current user. */
                is_blocked_boolean: Boolean(is_blocked),
                /** Indicates that the advertiser is a favourite of the current user. */
                is_favourite_boolean: Boolean(is_favourite),
                /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
                is_listed_boolean: Boolean(is_listed),
                /** Indicates if the advertiser is currently online. */
                is_online_boolean: Boolean(is_online),
                /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
                should_show_name: Boolean(show_name),
            });
        }
    }, [data, setP2PAdvertiserInfo]);

    return {
        /** P2P advertiser information */
        data: p2p_advertiser_info,
        subscribe,
        ...rest,
    };
};

export default useAdvertiserInfo;
