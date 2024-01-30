import React from 'react';
import {
    useAccountLimits,
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
} from '@deriv/api';
import { WalletsActionScreen } from '../../../../components';
import getWithdrawalLockedContent from './WithdrawalLockedContent';
import './WithdrawalLocked.scss';

const WithdrawalLocked: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: authentication } = useAuthentication();
    const { data: cashierValidation } = useCashierValidation();
    const { data: accountLimits } = useAccountLimits();
    const { data: status } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';

    const poaNeedsVerification = authentication?.is_poa_needed || false;
    const poiNeedsVerification = authentication?.is_poa_needed || false;
    const poaStatus = authentication?.poa_status || 'none';
    const poiStatus = authentication?.poi_status || 'none';

    const askAuthenticate = cashierValidation?.ask_authenticate || false;
    const askFinancialRiskApproval = cashierValidation?.ask_financial_risk_approval || false;
    const askFixDetails = cashierValidation?.ask_fix_details || false;
    const financialAssessmentRequired = cashierValidation?.financial_assessment_required || false;
    const noWithdrawalOrTradingStatus = cashierValidation?.no_withdrawal_or_trading_status || false;
    const withdrawalLockedStatus = cashierValidation?.withdrawal_locked_status || false;

    const isWithdrawalLocked = status?.is_withdrawal_locked || false;

    const remainder = accountLimits?.remainder;
    const minimumWithdrawal = activeWallet?.currency_config?.minimum_withdrawal;
    const withdrawalLimitReached = !!(
        typeof remainder !== 'undefined' &&
        typeof minimumWithdrawal !== 'undefined' &&
        +remainder < minimumWithdrawal
    );

    const state = isWithdrawalLocked
        ? getWithdrawalLockedContent({
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
