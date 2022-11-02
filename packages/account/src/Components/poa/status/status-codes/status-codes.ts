type TPoaStatusCodes = Readonly<Record<'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected', string>>;

export const poa_status_codes: TPoaStatusCodes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};
