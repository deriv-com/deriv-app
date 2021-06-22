export const populateVerificationStatus = account_status => {
    const { document, identity, needs_verification } = account_status.authentication;
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');

    const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');
    const identity_status = identity.status;

    const { idv, onfido, manual } = identity.services;
    // const identity_last_attempt = identity.attempts.latest;
    const identity_last_attempt = {
        id: 1,
        service: 'onfido',
        country_code: 'za',
        time: 166321,
    };

    return {
        allow_document_upload,
        has_poa,
        has_poi,
        needs_poa,
        needs_poi,
        needs_verification,
        idv,
        onfido,
        manual,
        identity_status,
        identity_last_attempt,
    };
};
