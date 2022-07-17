import { Authorize, GetAccountStatus } from '@deriv/api-types';
import React from 'react';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';
import {
    EmptyStateAskCurrency,
    EmptyStateAskFinancialRiskApproval,
    EmptyStateAskSelfExclusionMaxTurnoverSet,
    EmptyStateAskTINInformation,
    EmptyStateAskUKFundsProtection,
    EmptyStateCashierLockedAskAuthenticate,
    EmptyStateCashierLockedAskFixDetails,
    EmptyStateCashierLockedFinancialAssessmentRequired,
    EmptyStateCashierLockedStatus,
    EmptyStateCashierLockedSystemMaintenance,
    EmptyStateCryptoLockedSystemMaintenance,
    EmptyStateDepositLockedAskFixDetails,
    EmptyStateDepositLockedSystemMaintenance,
    EmptyStateDisabledStatus,
    EmptyStateDocumentsExpired,
    EmptyStateIdentityVerificationNeeded,
    EmptyStateNoResidence,
    EmptyStateNoWithdrawalOrTradingStatus,
    EmptyStateOnlyPAWithdrawalsAllowedStatus,
    EmptyStateSelfExclusion,
    EmptyStateUnwelcomeStatus,
    EmptyStateWithdrawalLockedAskAuthenticate,
    EmptyStateWithdrawalLockedAskFixDetails,
    EmptyStateWithdrawalLockedFinancialAssessmentRequired,
    EmptyStateWithdrawalLockedStatus,
    EmptyStateWithdrawalLockedSystemMaintenance,
    EmptyStateWithdrawServiceUnavailableForPA,
} from './cashier-locked-states';

type TAccount = NonNullable<Authorize['account_list']>[0];

type TProps = {
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    current_currency_type: string;
    is_cashier_locked: boolean;
    is_deposit_locked: boolean;
    is_identity_verification_needed: boolean;
    is_system_maintenance: boolean;
    is_withdrawal_locked: boolean;
    loginid: string;
};

const CashierLocked = ({
    account_status,
    accounts,
    current_currency_type,
    is_cashier_locked,
    is_deposit_locked,
    is_system_maintenance,
    is_withdrawal_locked,
    loginid,
    is_identity_verification_needed,
}: TProps) => {
    const { cashier_validation } = account_status;
    const no_residence = cashier_validation?.includes('no_residence');
    const unwelcome_status = cashier_validation?.includes('unwelcome_status');
    const self_exclusion = cashier_validation?.includes('SelfExclusion');
    const no_withdrawal_or_trading_status = cashier_validation?.includes('no_withdrawal_or_trading_status');
    const only_pa_withdrawals_allowed_status = cashier_validation?.includes('only_pa_withdrawals_allowed_status');
    const withdraw_service_unavailable_for_pa = cashier_validation?.includes('WithdrawServiceUnavailableForPA');
    const withdrawal_locked_status = cashier_validation?.includes('withdrawal_locked_status');
    const documents_expired = cashier_validation?.includes('documents_expired');
    const cashier_locked_status = cashier_validation?.includes('cashier_locked_status');
    const disabled_status = cashier_validation?.includes('disabled_status');
    const financial_assessment_required = cashier_validation?.includes('FinancialAssessmentRequired');
    const ask_currency = cashier_validation?.includes('ASK_CURRENCY');
    const ask_authenticate = cashier_validation?.includes('ASK_AUTHENTICATE');
    const ask_financial_risk_approval = cashier_validation?.includes('ASK_FINANCIAL_RISK_APPROVAL');
    const ask_tin_information = cashier_validation?.includes('ASK_TIN_INFORMATION');
    const ask_self_exclusion_max_turnover_set = cashier_validation?.includes('ASK_SELF_EXCLUSION_MAX_TURNOVER_SET');
    const ask_fix_details = cashier_validation?.includes('ASK_FIX_DETAILS');
    const ask_uk_funds_protection = cashier_validation?.includes('ASK_UK_FUNDS_PROTECTION');
    const is_crypto = current_currency_type === 'crypto';

    if (is_system_maintenance) {
        if (is_crypto && is_withdrawal_locked) return <EmptyStateWithdrawalLockedSystemMaintenance />;
        if (is_crypto && is_deposit_locked) return <EmptyStateDepositLockedSystemMaintenance />;
        if (is_crypto) return <EmptyStateCryptoLockedSystemMaintenance />;
        return <EmptyStateCashierLockedSystemMaintenance />;
    }

    if (is_cashier_locked) {
        if (no_residence) return <EmptyStateNoResidence />;
        if (documents_expired) return <EmptyStateDocumentsExpired />;
        if (cashier_locked_status) return <EmptyStateCashierLockedStatus />;
        if (disabled_status) return <EmptyStateDisabledStatus />;
        if (ask_currency) return <EmptyStateAskCurrency />;
        if (ask_authenticate && is_identity_verification_needed) return <EmptyStateIdentityVerificationNeeded />;
        if (ask_authenticate) return <EmptyStateCashierLockedAskAuthenticate />;
        if (ask_financial_risk_approval) return <EmptyStateAskFinancialRiskApproval />;
        if (financial_assessment_required) return <EmptyStateCashierLockedFinancialAssessmentRequired />;
        if (ask_tin_information) return <EmptyStateAskTINInformation />;
        if (ask_uk_funds_protection) return <EmptyStateAskUKFundsProtection />;
        if (ask_self_exclusion_max_turnover_set) return <EmptyStateAskSelfExclusionMaxTurnoverSet />;
        if (ask_fix_details) return <EmptyStateCashierLockedAskFixDetails />;
    }

    if (is_deposit_locked) {
        if (ask_fix_details) return <EmptyStateDepositLockedAskFixDetails />;
        if (self_exclusion) return <EmptyStateSelfExclusion excluded_until={accounts[loginid].excluded_until} />;
        if (unwelcome_status) return <EmptyStateUnwelcomeStatus />;
    }

    if (is_withdrawal_locked) {
        if (financial_assessment_required) return <EmptyStateWithdrawalLockedFinancialAssessmentRequired />;
        if (ask_authenticate) return <EmptyStateWithdrawalLockedAskAuthenticate />;
        if (ask_fix_details) return <EmptyStateWithdrawalLockedAskFixDetails />;
        if (withdraw_service_unavailable_for_pa) return <EmptyStateWithdrawServiceUnavailableForPA />;
        if (no_withdrawal_or_trading_status) return <EmptyStateNoWithdrawalOrTradingStatus />;
        if (withdrawal_locked_status) return <EmptyStateWithdrawalLockedStatus />;
        if (only_pa_withdrawals_allowed_status) return <EmptyStateOnlyPAWithdrawalsAllowedStatus />;
    }

    return <EmptyStateCashierLockedStatus />;
};

export default connect(({ client, modules }: RootStore) => ({
    account_status: client.account_status,
    accounts: client.accounts,
    current_currency_type: client.current_currency_type,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_deposit_locked: client.is_deposit_lock,
    is_system_maintenance: modules.cashier.general_store.is_system_maintenance,
    is_withdrawal_locked: client.is_withdrawal_lock,
    loginid: client.loginid,
    is_identity_verification_needed: client.is_identity_verification_needed,
}))(CashierLocked);
