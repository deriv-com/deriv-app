import { useMemo } from 'react';
import { useAuthentication, useMT5AccountsList } from '@deriv/api-v2';

export const usePOAInfo = () => {
    const { data: authenticationData, ...rest } = useAuthentication();
    const { data: mt5LoginList } = useMT5AccountsList();

    const modifiedPOIInfo = useMemo(() => {
        if (!authenticationData) return {};

        const {
            document,
            is_allow_document_upload: isAllowDocumentUpload,
            is_poa_address_mismatch: isPoaAddressMismatch,
            is_poa_resubmission_allowed: isPoaResubmissionAllowed,
            is_poi_needed: isPOINeeded,
        } = authenticationData;

        const hasRestrictedMT5Account = !!mt5LoginList?.filter(mt5_account =>
            mt5_account?.status?.includes('poa_failed')
        ).length;

        const isPOAResubmission =
            isPoaResubmissionAllowed ||
            (hasRestrictedMT5Account && ['expired', 'rejected', 'suspected'].includes(document?.status ?? '')) ||
            isPoaAddressMismatch;

        const documentNotRequired = !isAllowDocumentUpload;

        const documentSubmitted = document?.status === 'pending' && !isPoaResubmissionAllowed && !isPoaAddressMismatch;

        return {
            documentNotRequired,
            documentStatus: document?.status,
            documentSubmitted,
            isPOAResubmission,
            isPOINeeded,
        };
    }, [authenticationData, mt5LoginList]);

    return {
        data: modifiedPOIInfo,
        ...rest,
    };
};
