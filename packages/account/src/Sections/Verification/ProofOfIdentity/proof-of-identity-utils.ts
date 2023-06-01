export const identity_status_codes = Object.freeze({
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
});

export const submission_status_code = Object.freeze({
    selecting: 'selecting',
    submitting: 'submitting',
    complete: 'complete',
});

export const service_code = Object.freeze({
    idv: 'idv',
    onfido: 'onfido',
    manual: 'manual',
});
