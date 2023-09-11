import { localize } from '@deriv/translations';

export const getDefaultError = () => ({
    header: localize('Sorry for the interruption'),
    description: localize('Our servers hit a bump. Let’s refresh to move on.'),
    cta_label: localize('Refresh'),
});

export const idv_error_statuses = Object.freeze({
    poi_name_dob_mismatch: 'POI_NAME_DOB_MISMATCH',
    poi_dob_mismatch: 'POI_DOB_MISMATCH',
    poi_name_mismatch: 'POI_NAME_MISMATCH',
    poi_expired: 'POI_EXPIRED',
    poi_failed: 'POI_FAILED',
});
