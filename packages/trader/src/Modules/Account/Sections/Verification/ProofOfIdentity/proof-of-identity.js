export const onfido_status_codes = {
    none       : 'onfido',
    onfido     : 'onfido',
    pending    : 'pending',
    rejected   : 'rejected',
    verified   : 'verified',
    unsupported: 'unsupported',
    expired    : 'expired',
    suspected  : 'suspected',
};

export const getIdentityStatus = (identity, onfido_unsupported) => {
    const { further_resubmissions_allowed, status } = identity;

    if (!further_resubmissions_allowed) {
        if (status === 'none') {
            if (onfido_unsupported) return onfido_status_codes.unsupported;
            return onfido_status_codes.onfido;
        }
        return onfido_status_codes[status];
    }
    return onfido_status_codes.onfido;
};
