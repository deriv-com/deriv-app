import { useMemo } from 'react';
import { useAuthentication, useMT5AccountsList } from '@deriv/api';

const usePOAInfo = (landingCompanyShortCode: string) => {
    const { data: authenticationData, ...rest } = useAuthentication();
    const { data: mt5LoginList } = useMT5AccountsList();

    const modifiedPOIInfo = useMemo(() => {
        if (!authenticationData) return {};

        const {
            document,
            is_age_verified,
            is_allow_document_upload,
            is_poa_address_mismatch,
            is_poa_resubmission_allowed,
            is_poi_needed,
        } = authenticationData;

        const isMxMlt = landingCompanyShortCode === 'iom' || landingCompanyShortCode === 'malta';

        const hasRestrictedMT5Account = !!mt5LoginList?.filter(mt5_account =>
            mt5_account?.status?.includes('poa_failed')
        ).length;

        const isPOAResubmission =
            is_poa_resubmission_allowed ||
            (hasRestrictedMT5Account && ['expired', 'rejected', 'suspected'].includes(document?.status ?? '')) ||
            is_poa_address_mismatch;

        const documentNotRequired =
            !is_allow_document_upload ||
            (!is_age_verified && !is_poa_resubmission_allowed && document?.status === 'none' && isMxMlt);

        const documentSubmitted =
            document?.status === 'pending' && !is_poa_resubmission_allowed && !is_poa_address_mismatch;

        return {
            documentNotRequired,
            documentStatus: document?.status,
            documentSubmitted,
            isPOAResubmission,
            isPOINeeded: is_poi_needed,
        };
    }, [authenticationData, landingCompanyShortCode, mt5LoginList]);

    return {
        data: modifiedPOIInfo,
        ...rest,
    };
};

export default usePOAInfo;
