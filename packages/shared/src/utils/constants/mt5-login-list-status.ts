/**
 * this comes from mt5_login_list endpoint
 */
export const MT5_ACCOUNT_STATUS = {
    FAILED: 'failed',
    MIGRATED_WITH_POSITION: 'migrated_with_position',
    MIGRATED_WITHOUT_POSITION: 'migrated_without_position',
    NEEDS_VERIFICATION: 'needs_verification',
    PENDING: 'pending',
    POA_REQUIRED: 'poa_required',
    POA_PENDING: 'poa_pending',
    POA_OUTDATED: 'poa_outdated',
    POA_VERIFIED: 'poa_verified',
    UNDER_MAINTENANCE: 'under_maintenance',
    UNAVAILABLE: 'unavailable',
} as const;

/**
 * this comes from trading_platform_status endpoint
 */
export const TRADING_PLATFORM_STATUS = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
    MAINTENANCE: 'maintenance',
    UNAVAILABLE: 'unavailable',
} as const;
