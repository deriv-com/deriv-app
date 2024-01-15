import { useMemo } from 'react';
import { useGetAccountStatus } from '@deriv/api';

const usePoiPoaStatus = () => {
    const { data, ...rest } = useGetAccountStatus();

    // Add additional information to the account status response.
    const modified_account_status = useMemo(() => {
        if (!data?.authentication || !data?.p2p_poa_required) return;

        return {
            isP2PPoaRequired: data?.p2p_poa_required,
            poaStatus: data?.authentication?.document?.status,
            poiStatus: data?.authentication?.identity?.status,
        };
    }, [data]);

    return {
        /** The account status response. */
        data: modified_account_status,
        ...rest,
    };
};

export default usePoiPoaStatus;
