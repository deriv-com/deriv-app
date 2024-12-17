import { useMemo } from 'react';

import useGetAccountStatus from './useGetAccountStatus';

/** A custom hook to check the account status for the current user. */
const useAccountStatus = () => {
    const { data: get_account_status_data, ...rest } = useGetAccountStatus();

    // Add additional information to the account status response.
    const modified_account_status = useMemo(() => {
        if (!get_account_status_data?.status) return;

        const status = new Set(get_account_status_data?.status);

        return {
            /** Authentication*/
            authentication: get_account_status_data?.authentication,
            /** Account status. */
            status: get_account_status_data?.status,
            /** client's address is verified by third party services. */
            is_address_verified: status.has('address_verified'),
            /** client is allowed to upload documents. */
            is_allow_document_upload: status.has('allow_document_upload'),
            /** client is age-verified. */
            is_age_verification: status.has('age_verification'),
            /** client is fully authenticated. */
            is_authenticated: status.has('authenticated'),
            /** cashier is locked. */
            is_cashier_locked: status.has('cashier_locked'),
            /** client has updated tax related information. */
            is_crs_tin_information: status.has('crs_tin_information'),
            /** deposit is not allowed. */
            is_deposit_locked: status.has('deposit_locked'),
            /** account is disabled. */
            is_disabled: status.has('disabled'),
            /** client's submitted proof-of-identity documents have expired. */
            is_document_expired: status.has('document_expired'),
            /** client's submitted proof-of-identity documents are expiring within a month. */
            is_document_expiring_soon: status.has('document_expiring_soon'),
            /** Deriv X password is not set. */
            is_dxtrade_password_not_set: status.has('dxtrade_password_not_set'),
            /** client should complete their financial assessment. */
            is_financial_assessment_not_complete: status.has('financial_assessment_not_complete'),
            /** client has not completed financial assessment. */
            is_financial_information_not_complete: status.has('financial_information_not_complete'),
            /** client has accepted financial risk disclosure. */
            is_financial_risk_approval: status.has('financial_risk_approval'),
            /** client has not set financial limits on their account. Applies to UK and Malta clients. */
            is_max_turnover_limit_not_set: status.has('max_turnover_limit_not_set'),
            /** MT5 password is not set. */
            is_mt5_password_not_set: status.has('mt5_password_not_set'),
            /** MT5 deposits allowed, but withdrawal is not allowed. */
            is_mt5_withdrawal_locked: status.has('mt5_withdrawal_locked'),
            /** user must approve the Affiliate's Code of Conduct Agreement. */
            is_needs_affiliate_coc_approval: status.has('needs_affiliate_coc_approval'),
            /** trading is disabled. */
            is_no_trading: status.has('no_trading'),
            /** client cannot trade or withdraw but can deposit. */
            is_no_withdrawal_or_trading: status.has('no_withdrawal_or_trading'),
            /** p2p is blocked for the current payment agent client. */
            is_p2p_blocked_for_pa: status.has('p2p_blocked_for_pa'),
            /** withdrawal through payment agent is allowed. */
            is_pa_withdrawal_explicitly_allowed: status.has('pa_withdrawal_explicitly_allowed'),
            /** this client must reset their password. */
            is_password_reset_required: status.has('password_reset_required'),
            /** this client has opted for a professional account. */
            is_professional: status.has('professional'),
            /** this client has requested for a professional account. */
            is_professional_requested: status.has('professional_requested'),
            /** this client's request for a professional account has been rejected. */
            is_professional_rejected: status.has('professional_rejected'),
            /** this client is using social signup. */
            is_social_signup: status.has('social_signup'),
            /** client has not completed the trading experience questionnaire. */
            is_trading_experience_not_complete: status.has('trading_experience_not_complete'),
            /** client cannot deposit or buy contracts, but can withdraw or sell contracts. */
            is_unwelcome: status.has('unwelcome'),
            /** deposits allowed but withdrawals are not allowed. */
            is_withdrawal_locked: status.has('withdrawal_locked'),
            /** this prevent a client from changing the account currency after deposit attempt. */
            is_deposit_attempt: status.has('deposit_attempt'),
            /** client POI documents name mismatch. */
            is_poi_name_mismatch: status.has('poi_name_mismatch'),
            /** the client can resubmit POA documents. */
            is_allow_poa_resubmission: status.has('allow_poa_resubmission'),
            /** the client can resubmit POI documents. */
            is_allow_poi_resubmission: status.has('allow_poi_resubmission'),
            /** the client has been sharing payment methods. */
            is_shared_payment_method: status.has('shared_payment_method'),
            /** client is not allowed to edit personal profile details. */
            is_personal_details_locked: status.has('personal_details_locked'),
            /** it block any transfer between two accounts. */
            is_transfers_blocked: status.has('transfers_blocked'),
            /** the DF deposit will be blocked until the client gets age verified. */
            is_df_deposit_requires_poi: status.has('df_deposit_requires_poi'),
            /** the client has been fully authenticated by IDV. */
            is_authenticated_with_idv_photoid: status.has('authenticated_with_idv_photoid'),
            /** the client used to be fully authenticated by IDV but it was taken away due to compliance criteria. */
            is_idv_revoked: status.has('idv_revoked'),
        };
    }, [get_account_status_data?.authentication, get_account_status_data?.status]);

    return {
        /** The account status response. */
        data: modified_account_status,
        ...rest,
    };
};

export default useAccountStatus;
