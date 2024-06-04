import { useMemo } from 'react';
import { useGetAccountStatus } from '@deriv/api-v2';

/** A custom hook that returns the POA, POI status and if POA is required for P2P */
const usePoiPoaStatus = () => {
    const { data, ...rest } = useGetAccountStatus();

    // create new response for poi/poa statuses
    const modifiedAccountStatus = useMemo(() => {
        if (!data) return undefined;

        const documentStatus = data?.authentication?.document?.status;
        const identityStatus = data?.authentication?.identity?.status;

        return {
            isP2PPoaRequired: data?.p2p_poa_required,
            isPoaPending: documentStatus === 'pending',
            isPoaVerified: documentStatus === 'verified',
            isPoiPending: identityStatus === 'pending',
            isPoiVerified: identityStatus === 'verified',
            poaStatus: documentStatus,
            poiStatus: identityStatus,
        };
    }, [data]);

    return {
        /** The POI & POA status. */
        data: modifiedAccountStatus,
        ...rest,
    };
};

export default usePoiPoaStatus;
