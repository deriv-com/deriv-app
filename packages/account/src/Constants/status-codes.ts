import { TVerificationStatus } from '../Types';

export const AUTH_STATUS_CODES: TVerificationStatus = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};
