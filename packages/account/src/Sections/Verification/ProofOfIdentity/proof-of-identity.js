export const onfido_status_codes = {
    none: 'onfido',
    onfido: 'onfido',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    unsupported: 'unsupported',
    not_required: 'not_required',
    expired: 'expired',
    suspected: 'suspected',
};

export const getIdentityStatus = (identity, needs_verification, is_mlt_mx) => {
    const { status } = identity;
    const onfido_unsupported = !identity.services.onfido.is_country_supported;
    const submissions_allowed = needs_verification?.includes('identity');

    if (onfido_unsupported) return onfido_status_codes.unsupported;
    if (!submissions_allowed) {
        if (status === 'none' && is_mlt_mx) {
            return onfido_status_codes.not_required;
        }
        return onfido_status_codes[status];
    }
    return onfido_status_codes.onfido;
};
