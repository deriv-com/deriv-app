const populateVerificationStatus = account_status => {
    const { attempts, document, identity, needs_verification } = {
        ...account_status?.authentication,
        attempts: account_status?.authentication?.attempts || {},
        needs_verification: account_status?.authentication?.needs_verification || {},
    };
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');
    const accountStatusChecker = value_to_check => {
        return account_status?.status?.some(status => status === value_to_check);
    };
    const allow_document_upload = accountStatusChecker('allow_document_upload');
    const allow_poi_resubmission = accountStatusChecker('allow_poi_resubmission');
    const allow_poa_resubmission = accountStatusChecker('allow_poa_resubmission');
    const is_idv_disallowed = accountStatusChecker('idv_disallowed');

    const identity_status = identity?.status;
    const document_status = document?.status;


    const idv = identity?.services?.idv;
    const onfido = identity?.services?.onfido;
    const manual = identity?.services?.manual;
    const identity_last_attempt = attempts?.latest;
    const has_attempted_idv = !!(attempts?.history?.length && attempts?.history?.find(h => h.service === 'idv'));

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
        idv,
        is_idv_disallowed,
        manual,
        needs_poa,
        needs_poi,
        needs_verification,
        onfido,
    };
};
export default populateVerificationStatus;
