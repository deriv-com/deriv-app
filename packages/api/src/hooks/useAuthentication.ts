import { useMemo } from 'react';
import useGetAccountStatus from './useGetAccountStatus';

/** A custom hook to get the verification status (basically any poi, poa, poinc, poo) of the current user. */
const useAuthentication = () => {
    const { data: get_account_status_data, ...rest } = useGetAccountStatus();

    const modified_account_status = useMemo(() => {
        if (!get_account_status_data) return;

        const needs_verification = new Set(get_account_status_data.authentication?.needs_verification);
        const account_status = new Set(get_account_status_data?.status);

        const poa_status: string = get_account_status_data?.authentication?.document?.status || '';
        const poi_status: string = get_account_status_data?.authentication?.identity?.status || '';

        // const services = account_status?.authentication?.identity?.services ?? {};
        // const {
        //     idv: { status: idv_status } = {},
        //     onfido: { status: onfido_status } = {},
        //     manual: { status: manual_status } = {},
        // } = services;

        // const is_authenticated_with_idv_photoid = account_status?.status?.includes('authenticated_with_idv_photoid');
        // const is_idv_revoked = account_status?.status?.includes('idv_revoked');

        const acknowledged_status: string[] = ['pending', 'verified'];
        const failed_cases: string[] = ['rejected', 'expired', 'suspected'];

        // const poa_not_submitted: boolean = poa_status === 'none';
        // const need_poa_submission = !acknowledged_status.includes(poa_status);
        // const need_poa_resubmission: boolean = failed_cases.includes(poa_status);
        // const poa_verified: boolean = poa_status === 'verified';
        // const poa_pending: boolean = poa_status === 'pending';
        // const poa_acknowledged: boolean = acknowledged_status.includes(poa_status);

        // const poi_not_submitted: boolean = poi_status === 'none';
        // const poi_or_poa_not_submitted: boolean = poa_not_submitted || poi_not_submitted;
        // const poi_and_poa_not_submitted: boolean = poa_not_submitted && poi_not_submitted;

        return {
            ...get_account_status_data.authentication,
            /** client is required to verify their document (proof of address) */
            is_poa_needed: needs_verification.has('document'),
            /** client is required to verify their identity */
            is_poi_needed: needs_verification.has('identity'),
            /** client has been age-verified */
            is_age_verified: account_status.has('age_verification'),
            /** client is prevented from verifying from idv */
            is_idv_disallowed: account_status.has('idv_disallowed'),
            /** client is allowed to perform POI and POA (allow uploading documents) */
            is_allow_document_upload: account_status.has('is_allow_document_upload'),
            /** client can resubmit POI documents */
            is_poi_resubmission_allowed: account_status.has('allow_poi_resubmission'),
            /** client can resubmit POA documents */
            is_poa_resubmission_allowed: account_status.has('allow_poa_resubmission'),
            /** client's name in POI documents does not match */
            is_poi_name_mismatch: account_status.has('poi_name_mismatch'),
            /** client's name in POA documents does not match */
            is_poa_address_mismatch: account_status.has('poa_address_mismatch'),
            /** client has attempted POI before */
            has_poa_been_attempted: get_account_status_data?.authentication?.document?.status !== 'none',
            /** client has attempted POA before */
            has_poi_been_attempted: get_account_status_data?.authentication?.identity?.status !== 'none',
            /** client's poi verification status */
            poi_status: get_account_status_data?.authentication?.identity?.status,
            /** client's poa verification status */
            poa_status: get_account_status_data?.authentication?.document?.status,
            is_poa_not_submitted: poa_status === 'none',
            is_need_poa_submission: !acknowledged_status.includes(poa_status),
            is_need_poa_resubmission: failed_cases.includes(poa_status),
            is_poa_verified: poa_status === 'verified',
            is_poa_pending: poa_status === 'pending',
            is_poa_acknowledged: acknowledged_status.includes(poa_status),
            is_poi_not_submitted: poi_status === 'none',
        };
    }, [get_account_status_data]);

    return {
        data: modified_account_status,
        ...rest,
    };
};

export default useAuthentication;
