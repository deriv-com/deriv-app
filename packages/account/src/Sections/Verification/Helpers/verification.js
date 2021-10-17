export const populateVerificationStatus = account_status => {
    const { attempts, document, identity, needs_verification } = {
        ...account_status.authentication,
        attempts: account_status.attempts || {},
        needs_verification: account_status.needs_verification || {},
    };
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');

    const allow_document_upload = account_status?.status?.some(status => status === 'allow_document_upload');
    const allow_poi_resubmission = account_status?.status?.some(status => status === 'allow_poi_resubmission');
    const is_idv_disallowed = account_status?.status?.some(status => status === 'idv_disallowed');

    const identity_status = identity?.status;

    const idv = identity?.services?.idv;
    const onfido = identity?.services?.onfido;
    const manual = identity?.services?.manual;
    const identity_last_attempt = attempts?.latest;
    const has_attempted_idv = !!(attempts?.history?.length && attempts?.history?.find(h => h.service === 'idv'));

    return {
        allow_document_upload,
        allow_poi_resubmission,
        has_attempted_idv,
        has_poa,
        has_poi,
        identity_last_attempt,
        identity_status,
        idv,
        is_idv_disallowed,
        manual,
        needs_poa,
        needs_poi,
        needs_verification,
        onfido,
    };
};
