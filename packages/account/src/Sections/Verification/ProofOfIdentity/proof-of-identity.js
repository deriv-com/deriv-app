export const onfido_status_codes = {
    none: 'onfido',
    onfido: 'onfido',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    unsupported: 'unsupported',
    expired: 'expired',
    suspected: 'suspected',
};

export const getIdentityStatus = (identity, needs_verification, onfido_unsupported) => {
    const { status } = identity;
    const further_resubmissions_allowed = needs_verification?.includes('identity');

    if (onfido_unsupported) return onfido_status_codes.unsupported;
    if (further_resubmissions_allowed) {
        if (status === 'none') {
            return onfido_status_codes.onfido;
        }
        return onfido_status_codes[status];
    }
    return onfido_status_codes.onfido;
};
