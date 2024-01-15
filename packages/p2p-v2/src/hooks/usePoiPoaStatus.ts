import { useMemo } from 'react';
import { useGetAccountStatus } from '@deriv/api';

/** A custom hook that returns the POA, POI status and if POA is required for P2P */
const usePoiPoaStatus = () => {
    const { data, ...rest } = useGetAccountStatus();

    // create new response for poi/poa statuses
    const modifiedAccountStatus = useMemo(() => {
        if (!data?.authentication || !data?.p2p_poa_required) return;

        return {
            isP2PPoaRequired: data?.p2p_poa_required,
            poaStatus: data?.authentication?.document?.status,
            poiStatus: data?.authentication?.identity?.status,
        };
    }, [data]);

    return {
        /** The POI & POA status. */
        data: modifiedAccountStatus,
        ...rest,
    };
};

export default usePoiPoaStatus;
