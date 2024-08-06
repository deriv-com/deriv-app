import React from 'react';
import { useStore } from '@deriv/stores';

const AccountStatusList = [
    'address_verified',
    'age_verification',
    'allow_document_upload',
    'allow_poa_resubmission',
    'allow_poi_resubmission',
    'authenticated',
    'cashier_locked',
    'crs_tin_information',
    'deposit_attempt',
    'deposit_locked',
    'df_deposit_requires_poi',
    'disabled',
    'document_expired',
    'document_expiring_soon',
    'document_under_review',
    'dxtrade_password_not_set',
    'financial_assessment_not_complete',
    'financial_information_not_complete',
    'financial_risk_approval',
    'idv_revoked',
    'max_turnover_limit_not_set',
    'mt5_password_not_set',
    'mt5_withdrawal_locked',
    'needs_affiliate_coc_approval',
    'no_trading',
    'no_withdrawal_or_trading',
    'p2p_blocked_for_pa',
    'pa_withdrawal_explicitly_allowed',
    'password_reset_required',
    'personal_details_locked',
    'poi_name_mismatch',
    'professional',
    'professional_requested',
    'professional_rejected',
    'shared_payment_method',
    'social_signup',
    'transfers_blocked',
    'trading_experience_not_complete',
    'unwelcome',
    'withdrawal_locked',
] as const;

type TAccountStatus = typeof AccountStatusList[number];

/**
 * Custom hook to check if a particular account status is present.
 * @name useIsAccountStatusPresent
 * @param status of the account to check
 * @returns boolean
 */
const useIsAccountStatusPresent = (status: TAccountStatus) => {
    const {
        client: { account_status },
    } = useStore();

    const status_list = account_status?.status;

    return React.useMemo(() => status_list?.includes(status) ?? false, [status_list, status]);
};

export default useIsAccountStatusPresent;
