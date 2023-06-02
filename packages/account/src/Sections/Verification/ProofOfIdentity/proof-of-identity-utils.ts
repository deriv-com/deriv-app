export const identity_status_codes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
} as const;

export const submission_status_code = {
    selecting: 'selecting',
    submitting: 'submitting',
    complete: 'complete',
} as const;

export const service_code = {
    idv: 'idv',
    onfido: 'onfido',
    manual: 'manual',
} as const;
