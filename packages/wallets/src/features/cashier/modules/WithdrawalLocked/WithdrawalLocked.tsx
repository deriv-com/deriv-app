import React from 'react';
import { Trans } from 'react-i18next';
import {
    useAccountLimits,
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
} from '@deriv/api-v2';
import { WalletsActionScreen } from '../../../../components';
import getWithdrawalLockedDesc from './WithdrawalLockedContent';
import './WithdrawalLocked.scss';

const WithdrawalLocked: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: authentication } = useAuthentication();
    const { data: cashierValidation } = useCashierValidation();
    const { data: accountLimits } = useAccountLimits();
    const { data: status } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';

    const poaNeedsVerification = authentication?.is_poa_needed;
    const poiNeedsVerification = authentication?.is_poa_needed;
    const poaStatus = authentication?.poa_status || 'none';
    const poiStatus = authentication?.poi_status || 'none';

    const askAuthenticate = cashierValidation?.ask_authenticate;
    const askFinancialRiskApproval = cashierValidation?.ask_financial_risk_approval;
    const askFixDetails = cashierValidation?.ask_fix_details;
    const financialAssessmentRequired = cashierValidation?.financial_assessment_required;
    const noWithdrawalOrTradingStatus = cashierValidation?.no_withdrawal_or_trading_status;
    const withdrawalLockedStatus = cashierValidation?.withdrawal_locked_status;

    const isWithdrawalLocked = status?.is_withdrawal_locked;

    const remainder = accountLimits?.remainder;
    const minimumWithdrawal = activeWallet?.currency_config?.minimum_withdrawal;
    const withdrawalLimitReached = !!(
        typeof remainder !== 'undefined' &&
        typeof minimumWithdrawal !== 'undefined' &&
        +remainder < minimumWithdrawal
    );

    if (isWithdrawalLocked) {
        return (
            <div className='wallets-withdrawal-locked'>
                <WalletsActionScreen
                    description={
                        getWithdrawalLockedDesc({
                            askAuthenticate,
                            askFinancialRiskApproval,
                            askFixDetails,
                            financialAssessmentRequired,
                            noWithdrawalOrTradingStatus,
                            poaNeedsVerification,
                            poaStatus,
                            poiNeedsVerification,
                            poiStatus,
                            withdrawalLimitReached,
                            withdrawalLockedStatus,
                        })?.description
                    }
                    title={
                        <Trans
                            defaults='Withdrawals from your {{currency}} Wallet are temporarily locked.'
                            values={{ currency }}
                        />
                    }
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default WithdrawalLocked;
