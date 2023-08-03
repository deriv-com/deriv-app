import { TVerificationStatus } from '../../../../Types/common.type';

export const poa_status_codes: TVerificationStatus = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};
