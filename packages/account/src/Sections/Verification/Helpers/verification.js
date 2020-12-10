export const populateVerificationStatus = account_status => {
    const { document, identity, needs_verification } = account_status.authentication;
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');

    const is_unwelcome = account_status.status.some(acc_status => acc_status === 'unwelcome');
    const allow_document_upload = account_status.status.some(acc_status => acc_status === 'allow_document_upload');
    const onfido_supported_docs = identity.services.onfido.documents_supported;

    return { allow_document_upload, has_poa, has_poi, needs_poa, needs_poi, is_unwelcome, onfido_supported_docs };
};
