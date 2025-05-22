import { useMemo } from 'react';
import useAuthentication from './useAuthentication';

/** A custom hook to get the proof of address (poa) verification info of the current user  */
const usePOA = () => {
    const { data: authentication_data, ...rest } = useAuthentication();

    const modified_authentication_data = useMemo(() => {
        if (!authentication_data?.document) return;

        const needs_verification = new Set(authentication_data?.needs_verification);

        return {
            ...authentication_data.document,
            has_attempted_poa: authentication_data?.document.status !== 'none',
            is_pending: authentication_data?.document.status === 'pending',
            is_rejected: authentication_data?.document.status === 'rejected',
            is_expired: authentication_data?.document.status === 'expired',
            is_suspected: authentication_data?.document.status === 'suspected',
            is_verified: authentication_data?.document.status === 'verified',
            is_need_submission: !['pending', 'verified'].includes(authentication_data?.document.status || ''),
            poa_needs_verification: needs_verification.has('document'),
        };
    }, [authentication_data]);

    return {
        data: modified_authentication_data,
        ...rest,
    };
};

export default usePOA;
