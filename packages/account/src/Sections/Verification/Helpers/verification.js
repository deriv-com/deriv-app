export const populateVerificationStatus = account_status => {
    const { document, identity, needs_verification } = account_status.authentication;
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');

    const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');

    const documents_supported = identity.services.onfido.documents_supported;
    const country_code = identity.services.onfido.country_code;
    const submissions_left = identity.services.onfido.submissions_left;
    const rejected_reasons = identity.services.onfido.last_rejected;
    const identity_status = identity.status;
    const is_country_supported = identity.services.onfido.is_country_supported;

    return {
        allow_document_upload,
        is_country_supported,
        country_code,
        has_poa,
        has_poi,
        identity_status,
        needs_poa,
        needs_poi,
        needs_verification,
        documents_supported,
        rejected_reasons,
        submissions_left,
    };
};
