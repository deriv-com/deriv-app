import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCashierValidation,
    useIsEuRegion,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Loader } from '@deriv-com/ui';
import getCashierLockedDesc, { getSystemMaintenanceContent } from './CashierLockedContent';
import './CashierLocked.scss';

type TCashierLockedProps = {
    children?: React.ReactNode;
    module?: 'deposit' | 'transfer' | 'withdrawal';
};

const CashierLocked: React.FC<TCashierLockedProps> = ({ children, module }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus } = usePOA();
    const { data: cashierValidation } = useCashierValidation();
    const { data: accountStatus } = useAccountStatus();
    const { data: isEuRegion } = useIsEuRegion();

    const currency = activeWallet?.currency || 'USD';
    const isVirtual = activeWallet?.is_virtual;
    const isCrypto = activeWallet?.is_crypto;

    const poaNeedsVerification = poaStatus?.poa_needs_verification;
    const poiNeedsVerification = poiStatus?.poi_needs_verification;
    const isPendingVerification = poiStatus?.is_pending || poaStatus?.is_pending;

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

    const isSystemMaintenance = cashierValidation?.system_maintenance && !isVirtual;
    const isCashierLocked = accountStatus?.is_cashier_locked && !isVirtual;
    const isDepositLocked = accountStatus?.is_deposit_locked && module === 'deposit';
    const isWithdrawalLocked = accountStatus?.is_withdrawal_locked && module === 'withdrawal';

    const systemMaintenanceContent = getSystemMaintenanceContent({
        currency,
        isCashierLocked,
        isCrypto,
        isDepositLocked,
        isWithdrawalLocked,
    });

    const cashierLockedDescription = getCashierLockedDesc({
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
        isEuRegion,
        isPendingVerification,
        module,
        noResidence,
        poaNeedsVerification,
        poiNeedsVerification,
    });

    if (!accountStatus) {
        return <Loader />;
    }

    if (isSystemMaintenance && systemMaintenanceContent) {
        return (
            <div className='wallets-cashier-locked'>
                <ActionScreen
                    description={systemMaintenanceContent.description}
                    title={systemMaintenanceContent.title}
                />
            </div>
        );
    }

    if (isCashierLocked) {
        return (
            <div className='wallets-cashier-locked'>
                <ActionScreen
                    description={cashierLockedDescription}
                    title={
                        <Localize
                            i18n_default_text='Your {{currency}} Wallet is temporarily locked.'
                            values={{ currency }}
                        />
                    }
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default CashierLocked;
