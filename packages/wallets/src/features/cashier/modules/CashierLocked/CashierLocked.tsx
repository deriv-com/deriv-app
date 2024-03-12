import React from 'react';
import { Trans } from 'react-i18next';
import { useAccountStatus, useActiveWalletAccount, useAuthentication, useCashierValidation } from '@deriv/api-v2';
import { WalletsActionScreen } from '../../../../components';
import getCashierLockedDesc from './CashierLockedContent';
import './CashierLocked.scss';

const CashierLocked: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: authentication } = useAuthentication();
    const { data: cashierValidation } = useCashierValidation();
    const { data: status } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';
    const isVirtual = activeWallet?.is_virtual;

    const poaNeedsVerification = authentication?.is_poa_needed;
    const poiNeedsVerification = authentication?.is_poa_needed;

    const askAuthenticate = cashierValidation?.ask_authenticate;
    const askCurrency = cashierValidation?.ask_currency;
    const askFinancialRiskApproval = cashierValidation?.ask_financial_risk_approval;
    const askFixDetails = cashierValidation?.ask_fix_details;
    const askSelfExclusionMaxTurnoverSet = cashierValidation?.ask_self_exclusion_max_turnover_set;
    const askTinInformation = cashierValidation?.ask_tin_information;
    const cashierLockedStatus = cashierValidation?.cashier_locked_status;
    const disabledStatus = cashierValidation?.disabled_status;
    const documentsExpired = cashierValidation?.documents_expired;
    const financialAssessmentRequired = cashierValidation?.financial_assessment_required;
    const noResidence = cashierValidation?.no_residence;

    const isCashierLocked = status?.is_cashier_locked && !isVirtual;

    if (isCashierLocked) {
        return (
            <div className='wallets-cashier-locked'>
                <WalletsActionScreen
                    description={
                        getCashierLockedDesc({
                            askAuthenticate,
                            askCurrency,
                            askFinancialRiskApproval,
                            askFixDetails,
                            askSelfExclusionMaxTurnoverSet,
                            askTinInformation,
                            cashierLockedStatus,
                            currency,
                            disabledStatus,
                            documentsExpired,
                            financialAssessmentRequired,
                            noResidence,
                            poaNeedsVerification,
                            poiNeedsVerification,
                        })?.description
                    }
                    title={<Trans defaults='Your {{currency}} Wallet is temporarily locked.' values={{ currency }} />}
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default CashierLocked;
