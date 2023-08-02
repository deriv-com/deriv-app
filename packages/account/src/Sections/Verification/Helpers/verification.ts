import { GetAccountStatus } from '@deriv/api-types';

export const populateVerificationStatus = (account_status: GetAccountStatus) => {
    const has_poa = !(account_status?.authentication?.document?.status === 'none');
    const has_poi = !(account_status?.authentication?.identity?.status === 'none');
    const needs_poa = !!account_status?.authentication?.needs_verification.includes('document');
    const needs_poi = !!account_status?.authentication?.needs_verification.includes('identity');

    const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');
    const allow_poi_resubmission = account_status.status.some(status => status === 'allow_poi_resubmission');
    const allow_poa_resubmission = account_status.status.some(status => status === 'allow_poa_resubmission');
    const is_age_verified = account_status.status.some(status => status === 'age_verification');
    const is_idv_disallowed = account_status.status.some(status => status === 'idv_disallowed');
    const poa_address_mismatch = account_status.status.some(status => status === 'poa_address_mismatch');

    const identity_status = account_status?.authentication?.identity?.status;
    const document_status = account_status?.authentication?.document?.status;

    const identity_last_attempt = account_status.authentication?.attempts?.latest;
    const has_attempted_idv = !!(
        account_status.authentication?.attempts?.history?.length &&
        account_status.authentication.attempts.history.find(h => h.service === 'idv')
    );

    return {
        allow_document_upload,
        allow_poa_resubmission,
        allow_poi_resubmission,
        has_attempted_idv,
        has_poa,
        has_poi,
        identity_last_attempt,
        identity_status,
        document_status,
        idv: account_status?.authentication?.identity?.services?.idv,
        is_age_verified,
        is_idv_disallowed,
        manual: account_status?.authentication?.identity?.services?.manual,
        needs_poa,
        needs_poi,
        needs_verification: account_status?.authentication?.needs_verification,
        onfido: account_status?.authentication?.identity?.services?.onfido,
        poa_address_mismatch,
    };
};
