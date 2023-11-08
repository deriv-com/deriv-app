import { localize } from '@deriv/translations';

export const getDefaultError = () => ({
    header: localize('Sorry for the interruption'),
    description: localize('Our servers hit a bump. Let’s refresh to move on.'),
    cta_label: localize('Refresh'),
});

export const STATUS_CODES = Object.freeze({
    NONE: 'none',
    PENDING: 'pending',
    REJECTED: 'rejected',
    VERIFIED: 'verified',
    EXPIRED: 'expired',
    SUSPECTED: 'suspected',
});
