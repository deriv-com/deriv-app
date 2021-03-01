export const populateVerificationStatus = account_status => {
    const { document, identity, needs_verification } = account_status.authentication;
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');

    const is_unwelcome = account_status.status.some(status => status === 'unwelcome');
    const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');
    const onfido_supported_docs = identity.services.onfido.documents_supported;
    const country_code = identity.services.onfido.country_code;
    const submissions_left = identity.services.onfido.submissions_left;
    const rejected_reasons = identity.services.onfido.last_rejected;

    return {
        allow_document_upload,
        country_code,
        has_poa,
        has_poi,
        is_unwelcome,
        needs_poa,
        needs_poi,
        onfido_supported_docs,
        rejected_reasons,
        submissions_left,
    };
};
