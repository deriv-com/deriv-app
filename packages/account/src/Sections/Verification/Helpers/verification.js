export const populateVerificationStatus = account_status => {
    const { attempts, document, identity, needs_verification, income } = account_status.authentication;
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const has_poinc = !(income && income.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');
    // const needs_poinc = needs_verification.length && needs_verification.includes('income');
    const needs_poinc = true; /* this line should be removed and uncomitted above one */

    // const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');
    const allow_document_upload = true; /* this line should be removed and uncomitted above one */
    const allow_poi_resubmission = account_status.status.some(status => status === 'allow_poi_resubmission');
    const allow_poa_resubmission = account_status.status.some(status => status === 'allow_poa_resubmission');
    // const is_age_verified = account_status.status.some(status => status === 'age_verification');
    const is_age_verified = true; /* this line should be removed and uncomitted above one */
    const is_idv_disallowed = account_status.status.some(status => status === 'idv_disallowed');

    const identity_status = identity.status;
    const document_status = document.status;
    // const income_status = income.status;
    const income_status = 'none'; /* this line should be removed and uncomitted above one */

    const { idv, onfido, manual } = identity.services;
    const identity_last_attempt = attempts.latest;
    const has_attempted_idv = !!(attempts.history.length && attempts.history.find(h => h.service === 'idv'));

    return {
        allow_document_upload,
        allow_poa_resubmission,
        allow_poi_resubmission,
        has_attempted_idv,
        has_poa,
        has_poi,
        has_poinc,
        identity_last_attempt,
        identity_status,
        document_status,
        income_status,
        idv,
        is_age_verified,
        is_idv_disallowed,
        manual,
        needs_poa,
        needs_poi,
        needs_poinc,
        needs_verification,
        onfido,
    };
};
