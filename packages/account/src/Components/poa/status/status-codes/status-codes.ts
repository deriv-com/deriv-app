type T_poa_status_codes = Readonly<
    Record<'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected', string>
>;

export const poa_status_codes: T_poa_status_codes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};
