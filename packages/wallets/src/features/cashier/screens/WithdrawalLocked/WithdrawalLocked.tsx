import React from 'react';
import { useAccountLimits, useActiveWalletAccount } from '@deriv/api';
import { WalletsActionScreen } from '../../../../components';
import type { THooks } from '../../../../types';
import withdrawalLockedProvider from './WithdrawalLockedProvider';
import './WithdrawalLocked.scss';

type TProps = {
    accountStatus: THooks.GetAccountStatus;
};

const WithdrawalLocked: React.FC<React.PropsWithChildren<TProps>> = ({ accountStatus, children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: accountLimits } = useAccountLimits();

    const authentication = accountStatus?.authentication;
    const cashierValidation = accountStatus?.cashier_validation;
    const status = accountStatus?.status;

    const askAuthenticate = cashierValidation?.includes('ASK_AUTHENTICATE') || false;
    const askFinancialRiskApproval = cashierValidation?.includes('ASK_FINANCIAL_RISK_APPROVAL') || false;
    const askFixDetails = cashierValidation?.includes('ASK_FIX_DETAILS') || false;
    const currency = activeWallet?.currency || 'USD';
    const financialAssessmentRequired = cashierValidation?.includes('FinancialAssessmentRequired') || false;
    const isWithdrawalLocked = status?.includes('withdrawal_locked');
    const noWithdrawalOrTradingStatus = cashierValidation?.includes('no_withdrawal_or_trading_status') || false;
    const poaNeedsVerification = authentication?.needs_verification?.includes('document') || false;
    const poaStatus = authentication?.document?.status || 'none';
    const poiNeedsVerification = authentication?.needs_verification?.includes('identity') || false;
    const poiStatus = authentication?.identity?.status || 'none';
    const withdrawalLockedStatus = cashierValidation?.includes('withdrawal_locked_status') || false;

    const remainder = accountLimits?.remainder;
    const minimumWithdrawal = activeWallet?.currency_config?.minimum_withdrawal;
    const withdrawalLimitReached = !!(
        typeof remainder !== 'undefined' &&
        typeof minimumWithdrawal !== 'undefined' &&
        +remainder < minimumWithdrawal
    );

    const state = isWithdrawalLocked
        ? withdrawalLockedProvider({
              askAuthenticate,
              askFinancialRiskApproval,
              askFixDetails,
              currency,
              financialAssessmentRequired,
              noWithdrawalOrTradingStatus,
              poaNeedsVerification,
              poaStatus,
              poiNeedsVerification,
              poiStatus,
              withdrawalLimitReached,
              withdrawalLockedStatus,
          })
        : undefined;

    if (state) {
        return (
            <div className='wallets-withdrawal-locked'>
                <WalletsActionScreen description={state?.description} title={state?.title} />
            </div>
        );
    }

    return <>{children}</>;
};

export default WithdrawalLocked;
